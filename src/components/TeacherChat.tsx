import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { MessageSquare, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

interface TeacherChatProps {
  teacher: any;
}

export default function TeacherChat({ teacher }: TeacherChatProps) {
  const [passcodeSearch, setPasscodeSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    loadChats();
  }, [teacher]);

  const loadChats = () => {
    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
    const myChats = allChats.filter((c: any) => c.teacherId === teacher.id);
    setChats(myChats);
  };

  const searchParent = () => {
    if (!passcodeSearch.trim()) {
      toast.error('Please enter a passcode');
      return;
    }

    const parents = JSON.parse(localStorage.getItem('parents') || '[]');
    const parent = parents.find((p: any) => p.secretPasscode === passcodeSearch);

    if (parent) {
      setSelectedParent(parent);
      toast.success(`Found parent: ${parent.name}`);
    } else {
      toast.error('No parent found with this passcode');
      setSelectedParent(null);
    }
  };

  const sendMessage = () => {
    if (!selectedParent) {
      toast.error('Please search and select a parent first');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const newChat = {
      id: `CHAT${Date.now()}`,
      parentId: selectedParent.id,
      parentName: selectedParent.name,
      parentPasscode: selectedParent.secretPasscode,
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: teacher.subject,
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
    toast.success('Message sent to ' + selectedParent.name);
  };

  const getConversation = (parentPasscode: string) => {
    return chats
      .filter((c: any) => c.parentPasscode === parentPasscode)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const selectedConversation = selectedParent ? getConversation(selectedParent.secretPasscode) : [];

  // Get list of unique parents who have chatted
  const uniqueParents = Array.from(
    new Set(chats.map((c: any) => c.parentPasscode))
  ).map(passcode => {
    const chat = chats.find((c: any) => c.parentPasscode === passcode);
    return {
      passcode: chat.parentPasscode,
      name: chat.parentName,
      lastMessage: chats
        .filter((c: any) => c.parentPasscode === passcode)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    };
  });

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
              Use parent's secret passcode to find and message them
            </p>
          </div>

          <div>
            <label className="text-sm mb-2 block">Search Parent by Passcode</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter parent's secret passcode"
                value={passcodeSearch}
                onChange={(e) => setPasscodeSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchParent()}
              />
              <Button onClick={searchParent}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {selectedParent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Selected Parent:</strong> {selectedParent.name}
              </p>
              <p className="text-xs text-green-700">
                Email: {selectedParent.email} | Phone: {selectedParent.phone}
              </p>
            </div>
          )}

          {uniqueParents.length > 0 && (
            <div>
              <label className="text-sm mb-2 block">Recent Conversations</label>
              <div className="space-y-2">
                {uniqueParents.map((parent) => (
                  <button
                    key={parent.passcode}
                    onClick={() => {
                      setPasscodeSearch(parent.passcode);
                      searchParent();
                    }}
                    className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <p className="text-sm">{parent.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {parent.lastMessage.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(parent.lastMessage.timestamp).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedParent && (
            <>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Conversation with {selectedParent.name}
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
