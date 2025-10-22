import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Megaphone, Send, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface AnnouncementsEnhancedProps {
  user: any;
  userRole: 'admin' | 'teacher';
}

export default function AnnouncementsEnhanced({ user, userRole }: AnnouncementsEnhancedProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'student' | 'teacher' | ''>('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

  const subjects = ['English', 'Tamil', 'Mathematics'];

  // Calculate recipient count
  const getRecipientCount = () => {
    if (userRole === 'admin') {
      if (targetAudience === 'teacher') {
        return teachers.length;
      } else if (targetAudience === 'student') {
        return students.filter((s: any) => {
          const gradeMatch = selectedGrade === 'all' || s.grade === parseInt(selectedGrade);
          const subjectMatch = selectedSubject === 'all' || s.subjects.includes(selectedSubject);
          return gradeMatch && subjectMatch;
        }).length;
      }
    } else if (userRole === 'teacher') {
      return students.filter((s: any) => {
        const gradeMatch = selectedGrade === 'all' || s.grade === parseInt(selectedGrade);
        const subjectMatch = s.subjects.includes(user.subject);
        return gradeMatch && subjectMatch;
      }).length;
    }
    return 0;
  };

  const sendAnnouncement = () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    if (userRole === 'admin' && !targetAudience) {
      toast.error('Please select target audience');
      return;
    }

    const recipientCount = getRecipientCount();
    if (recipientCount === 0) {
      toast.error('No recipients match the selected criteria');
      return;
    }

    const announcement = {
      id: `ANN${Date.now()}`,
      title,
      message,
      senderName: user.name,
      senderRole: userRole,
      senderSubject: userRole === 'teacher' ? user.subject : null,
      targetAudience: userRole === 'admin' ? targetAudience : 'student',
      grade: selectedGrade,
      subject: userRole === 'teacher' ? user.subject : selectedSubject,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Create notifications for recipients
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

    if (userRole === 'admin') {
      if (targetAudience === 'teacher') {
        // Send to all teachers
        teachers.forEach((teacher: any) => {
          notifications.push({
            id: `N${Date.now()}_${teacher.id}`,
            type: 'announcement',
            title: announcement.title,
            message: announcement.message,
            senderName: announcement.senderName,
            senderRole: announcement.senderRole,
            timestamp: announcement.timestamp,
            read: false,
            targetRole: 'teacher',
            targetId: teacher.id,
          });
        });
      } else if (targetAudience === 'student') {
        // Send to filtered students
        students
          .filter((s: any) => {
            const gradeMatch = selectedGrade === 'all' || s.grade === parseInt(selectedGrade);
            const subjectMatch = selectedSubject === 'all' || s.subjects.includes(selectedSubject);
            return gradeMatch && subjectMatch;
          })
          .forEach((student: any) => {
            notifications.push({
              id: `N${Date.now()}_${student.id}`,
              type: 'announcement',
              title: announcement.title,
              message: announcement.message,
              senderName: announcement.senderName,
              senderRole: announcement.senderRole,
              timestamp: announcement.timestamp,
              read: false,
              targetRole: 'student',
              targetId: student.id,
            });
          });
      }
    } else if (userRole === 'teacher') {
      // Teacher sends to students
      students
        .filter((s: any) => {
          const gradeMatch = selectedGrade === 'all' || s.grade === parseInt(selectedGrade);
          const subjectMatch = s.subjects.includes(user.subject);
          return gradeMatch && subjectMatch;
        })
        .forEach((student: any) => {
          notifications.push({
            id: `N${Date.now()}_${student.id}`,
            type: 'announcement',
            title: announcement.title,
            message: announcement.message,
            senderName: announcement.senderName,
            senderRole: announcement.senderRole,
            senderSubject: user.subject,
            timestamp: announcement.timestamp,
            read: false,
            targetRole: 'student',
            targetId: student.id,
          });
        });
    }

    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Save announcement
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements.push(announcement);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    toast.success(`Announcement sent to ${recipientCount} recipient(s)!`);
    
    // Reset form
    setTitle('');
    setMessage('');
    setTargetAudience('');
    setSelectedGrade('all');
    setSelectedSubject('all');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Megaphone className={`h-5 w-5 ${userRole === 'admin' ? 'text-gray-600' : 'text-blue-600'}`} />
            <CardTitle>Send Announcement</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title</Label>
            <Input
              id="title"
              placeholder="Enter announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter announcement message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          {userRole === 'admin' && (
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select value={targetAudience} onValueChange={(value: any) => setTargetAudience(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {((userRole === 'admin' && targetAudience === 'student') || userRole === 'teacher') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="grade">Filter by Grade</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="6">Grade 6</SelectItem>
                    <SelectItem value="7">Grade 7</SelectItem>
                    <SelectItem value="8">Grade 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userRole === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Filter by Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* Recipient Preview */}
          {(targetAudience || userRole === 'teacher') && (
            <div className={`border rounded-lg p-4 ${userRole === 'admin' ? 'bg-gray-50' : 'bg-blue-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className={`h-4 w-4 ${userRole === 'admin' ? 'text-gray-600' : 'text-blue-600'}`} />
                  <span className="text-sm">Recipients:</span>
                </div>
                <Badge variant="secondary">{getRecipientCount()} people</Badge>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {userRole === 'admin' && targetAudience === 'teacher' && 'All teachers will receive this announcement'}
                {userRole === 'admin' && targetAudience === 'student' && `Students in ${selectedGrade === 'all' ? 'all grades' : `Grade ${selectedGrade}`}${selectedSubject === 'all' ? '' : ` taking ${selectedSubject}`}`}
                {userRole === 'teacher' && `Your students in ${selectedGrade === 'all' ? 'all grades' : `Grade ${selectedGrade}`} taking ${user.subject}`}
              </p>
            </div>
          )}

          <Button
            className={`w-full ${userRole === 'admin' ? 'bg-gray-700 hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={sendAnnouncement}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Announcement to {getRecipientCount()} Recipient(s)
          </Button>
        </CardContent>
      </Card>

      {/* Past Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const myAnnouncements = announcements
              .filter((a: any) => {
                if (userRole === 'admin') return a.senderRole === 'admin';
                if (userRole === 'teacher') return a.senderRole === 'teacher' && a.senderName === user.name;
                return false;
              })
              .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5);

            if (myAnnouncements.length === 0) {
              return (
                <div className="text-center py-8">
                  <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No announcements sent yet</p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {myAnnouncements.map((announcement: any) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4>{announcement.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {announcement.targetAudience === 'teacher' ? 'Teachers' : 'Students'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(announcement.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
