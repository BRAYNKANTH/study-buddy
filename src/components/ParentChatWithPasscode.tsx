import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageSquare, Send, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { teachers } from '../lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ParentChatWithPasscodeProps {
  parent: any;
  onBack?: () => void;
}

export default function ParentChatWithPasscode({ parent, onBack }: ParentChatWithPasscodeProps) {
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadChats();
    }
  }, [parent, isAuthenticated]);

  const loadChats = () => {
    const stored = localStorage.getItem('chats');
    let allChats: any[] = [];

    try {
      const parsed = JSON.parse(stored || '[]');
      if (Array.isArray(parsed)) {
        allChats = parsed;
      } else {
        console.warn('Invalid chat data in localStorage, resetting...');
        localStorage.setItem('chats', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to parse chat data:', error);
      localStorage.setItem('chats', JSON.stringify([]));
    }

    const myChats = allChats.filter((c: any) => c.parentId === parent.id);
    setChats(myChats);
  };

  const verifyPasscode = () => {
    if (passcodeInput === parent.secretPasscode) {
      setIsAuthenticated(true);
      setShowPasscodeDialog(false);
      toast.success('Access granted!');
      setPasscodeInput('');
    } else {
      toast.error('Incorrect passcode');
    }
  };

  const handleChatOpen = () => {
    if (!isAuthenticated) {
      setShowPasscodeDialog(true);
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
      message: message,
      sender: 'parent',
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
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

  // 🔒 If not authenticated yet
  if (!isAuthenticated) {
    return (
      <>
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="mb-2">Chat with Teachers</h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter your secret passcode to access teacher chat
            </p>
            <Button onClick={handleChatOpen}>
              <Lock className="h-4 w-4 mr-2" />
              Unlock Chat
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showPasscodeDialog} onOpenChange={setShowPasscodeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Secret Passcode</DialogTitle>
              <DialogDescription>
                Enter your secret passcode to access teacher communication
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                type="password"
                placeholder="Enter your secret passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyPasscode()}
              />
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={verifyPasscode}>
                  Verify
                </Button>
                <Button variant="outline" onClick={() => setShowPasscodeDialog(false)}>
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Forgot your passcode? Contact admin for help
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // 💬 Authenticated UI
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <CardTitle>Chat with Teachers</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAuthenticated(false);
                setSelectedTeacher('');
              }}
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock Chat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Your Secret Passcode:</strong> {parent.secretPasscode}
            </p>
            <p className="text-xs text-green-700 mt-1">
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
                              ? 'bg-green-600 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-sm">{chat.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              chat.sender === 'parent' ? 'text-green-200' : 'text-gray-500'
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
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={sendMessage}>
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
