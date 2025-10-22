import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, CheckCircle, XCircle, FileText, DollarSign, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ParentNotificationsProps {
  parent: any;
}

export default function ParentNotifications({ parent }: ParentNotificationsProps) {
  const [filter, setFilter] = useState('all');

  const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const myNotifications = allNotifications.filter(
    (n: any) => n.targetRole === 'parent' || n.targetRole === 'student'
  );

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const myStudentIds = students.filter((s: any) => s.parentId === parent.id).map((s: any) => s.id);

  const relevantNotifications = myNotifications.filter((n: any) => {
    if (n.targetRole === 'parent' && n.targetId && n.targetId !== parent.id) return false;
    if (n.targetRole === 'student' && n.targetId && !myStudentIds.includes(n.targetId)) return false;
    return true;
  });

  const filteredNotifications = relevantNotifications.filter((n: any) => {
    if (filter === 'all') return true;
    return n.type === filter;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'material':
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'marks':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="material">Materials</SelectItem>
                <SelectItem value="marks">Marks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {getTimeSince(notification.timestamp)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
