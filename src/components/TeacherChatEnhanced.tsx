import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface TeacherChatEnhancedProps {
  teacher: any;
}

export default function TeacherChatEnhanced({ teacher }: TeacherChatEnhancedProps) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const parents = JSON.parse(localStorage.getItem('parents') || '[]');

  // Get students enrolled in this teacher's subject
  const myStudents = students.filter((s: any) => s.subjects.includes(teacher.subject));

  useEffect(() => {
    loadChats();
  }, [teacher]);

  const loadChats = () => {
    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
    const myChats = allChats.filter((c: any) => c.teacherId === teacher.id);
    setChats(myChats);
  };

  const sendMessage = () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const student = students.find((s: any) => s.id === selectedStudent);
    if (!student) return;

    const parent = parents.find((p: any) => p.id === student.parentId);
    if (!parent) {
      toast.error('Parent information not found');
      return;
    }

    const newChat = {
      id: `CHAT${Date.now()}`,
      parentId: parent.id,
      parentName: parent.name,
      parentPasscode: parent.secretPasscode,
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: teacher.subject,
      studentId: student.id,
      studentName: student.name,
      message: message,
      sender: 'teacher',
      timestamp: new Date().toISOString(),
      read: false
    };

    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
    allChats.push(newChat);
    localStorage.setItem('chats', JSON.stringify(allChats));

    setChats(prev => [...prev, newChat]);
    setMessage('');
    toast.success(`Message sent to ${parent.name} (${student.name}'s parent)`);
  };

  const getConversation = (studentId: string) => {
    return chats
      .filter((c: any) => c.studentId === studentId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const selectedConversation = selectedStudent ? getConversation(selectedStudent) : [];
  const selectedStudentData = students.find((s: any) => s.id === selectedStudent);
  const selectedParentData = selectedStudentData 
    ? parents.find((p: any) => p.id === selectedStudentData.parentId)
    : null;

  // Get list of students with active conversations
  const studentsWithChats = Array.from(
    new Set(chats.map((c: any) => c.studentId))
  ).map(studentId => {
    const student = students.find((s: any) => s.id === studentId);
    const lastMessage = chats
      .filter((c: any) => c.studentId === studentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    return { student, lastMessage };
  }).filter(item => item.student);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <CardTitle>Chat with Parents</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Select a student to communicate with their parent directly
            </p>
          </div>

          <div>
            <label className="text-sm mb-2 block">Select Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student to message their parent" />
              </SelectTrigger>
              <SelectContent>
                {myStudents.map((student: any) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} (Grade {student.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {studentsWithChats.length > 0 && (
            <div>
              <label className="text-sm mb-2 block">Recent Conversations</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {studentsWithChats.map(({ student, lastMessage }) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      selectedStudent === student.id 
                        ? 'bg-indigo-50 border-indigo-300' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm">{student.name}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {lastMessage.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(lastMessage.timestamp).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedStudent && selectedParentData && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Chatting with:</strong> {selectedParentData.name} ({selectedStudentData?.name}'s Parent)
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Email: {selectedParentData.email} | Phone: {selectedParentData.phone}
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Conversation about {selectedStudentData?.name}
                  </p>
                </div>

                {selectedConversation.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400">Start the conversation below</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedConversation.map((chat: any) => (
                      <div
                        key={chat.id}
                        className={`flex ${chat.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            chat.sender === 'teacher'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-xs mb-1 opacity-75">
                            {chat.sender === 'teacher' ? 'You' : chat.parentName}
                          </p>
                          <p className="text-sm">{chat.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              chat.sender === 'teacher' ? 'text-indigo-200' : 'text-gray-500'
                            }`}
                          >
                            {new Date(chat.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <Button className="w-full" onClick={sendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message to {selectedParentData.name}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
