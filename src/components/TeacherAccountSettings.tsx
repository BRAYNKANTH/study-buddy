import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, User, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface TeacherAccountSettingsProps {
  teacher: any;
  onUpdate: (updatedTeacher: any) => void;
}

export default function TeacherAccountSettings({ teacher, onUpdate }: TeacherAccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (currentPassword !== teacher.password) {
      toast.error('Current password is incorrect');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Update password in localStorage
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const teacherIndex = teachers.findIndex((t: any) => t.id === teacher.id);
    
    if (teacherIndex !== -1) {
      teachers[teacherIndex].password = newPassword;
      localStorage.setItem('teachers', JSON.stringify(teachers));
      onUpdate(teachers[teacherIndex]);
      
      toast.success('Password reset successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle>Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={teacher.name} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={teacher.email} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Subject</Label>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <Input value={teacher.subject} disabled className="bg-gray-50" />
              </div>
            </div>
            <div>
              <Label>Teacher ID</Label>
              <Input value={teacher.id} disabled className="bg-gray-50" />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Contact admin to update profile information
          </p>
        </CardContent>
      </Card>

      {/* Reset Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-600" />
            <CardTitle>Reset Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={resetPassword}
          >
            <Lock className="h-4 w-4 mr-2" />
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
