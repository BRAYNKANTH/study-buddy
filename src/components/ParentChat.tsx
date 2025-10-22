import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { teachers } from '../lib/mockData';

interface ParentChatProps {
  parent: any;
  onBack?: () => void; // ✅ added optional back prop
}

export default function ParentChat({ parent, onBack }: ParentChatProps) {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    loadChats();
  }, [parent]);

  const loadChats = () => {
    try {
      const stored = localStorage.getItem('chats');
      const parsed = JSON.parse(stored || '[]');
      const allChats = Array.isArray(parsed) ? parsed : [];
      const myChats = allChats.filter(
        (c: any) => c.parentId === parent.id || c.parentPasscode === parent.secretPasscode
      );
      setChats(myChats);
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    }
  };

  const sendMessage = () => {
    if (!selectedTeacher) {
      toast.error('Please select a teacher');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const teacher = teachers.find((t) => t.id === selectedTeacher);
    if (!teacher) return;

    const newChat = {
      id: `CHAT${Date.now()}`,
      parentId: parent.id,
      parentName: parent.name,
      parentPasscode: parent.secretPasscode,
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: teacher.subject,
      message,
      sender: 'parent',
      timestamp: new Date().toISOString(),
      read: false,
    };

    const stored = localStorage.getItem('chats');
    const allChats = Array.isArray(JSON.parse(stored || '[]'))
      ? JSON.parse(stored || '[]')
      : [];
    allChats.push(newChat);
    localStorage.setItem('chats', JSON.stringify(allChats));

    setChats((prev) => [...prev, newChat]);
    setMessage('');
    toast.success('Message sent to ' + teacher.name);
  };

  const getConversation = (teacherId: string) => {
    return chats
      .filter(
        (c: any) =>
          (c.teacherId === teacherId && c.parentId === parent.id) ||
          (c.teacherId === teacherId && c.parentPasscode === parent.secretPasscode)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const selectedConversation = selectedTeacher ? getConversation(selectedTeacher) : [];
  const selectedTeacherData = teachers.find((t) => t.id === selectedTeacher);

  return (
    <div className="space-y-6">
      {/* ✅ Back to Dashboard button */}
      {onBack && (
        <div>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <CardTitle>Chat with Teachers</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Your Secret Passcode:</strong> {parent.secretPasscode}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Teachers can use this passcode to identify and message you securely
            </p>
          </div>

          <div>
            <label className="text-sm mb-2 block">Select Teacher</label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a teacher to chat with" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTeacher && (
            <>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Conversation with {selectedTeacherData?.name}
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
                        className={`flex ${
                          chat.sender === 'parent' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            chat.sender === 'parent'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-sm">{chat.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              chat.sender === 'parent' ? 'text-indigo-200' : 'text-gray-500'
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
                  Send Message
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
