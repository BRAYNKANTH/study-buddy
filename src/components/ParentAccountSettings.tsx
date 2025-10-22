import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, Key, User } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from './ui/separator';

interface ParentAccountSettingsProps {
  parent: any;
  onUpdate: (updatedParent: any) => void;
}

export default function ParentAccountSettings({ parent, onUpdate }: ParentAccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const resetPassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (currentPassword !== parent.password) {
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
    const parents = JSON.parse(localStorage.getItem('parents') || '[]');
    const parentIndex = parents.findIndex((p: any) => p.id === parent.id);
    
    if (parentIndex !== -1) {
      parents[parentIndex].password = newPassword;
      localStorage.setItem('parents', JSON.stringify(parents));
      onUpdate(parents[parentIndex]);
      
      toast.success('Password reset successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const resetPasscode = () => {
    if (!newPasscode || !confirmPasscode) {
      toast.error('Please fill all passcode fields');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      toast.error('Passcodes do not match');
      return;
    }

    if (newPasscode.length < 4) {
      toast.error('Passcode must be at least 4 characters');
      return;
    }

    // Update passcode in localStorage
    const parents = JSON.parse(localStorage.getItem('parents') || '[]');
    const parentIndex = parents.findIndex((p: any) => p.id === parent.id);
    
    if (parentIndex !== -1) {
      parents[parentIndex].secretPasscode = newPasscode;
      localStorage.setItem('parents', JSON.stringify(parents));
      onUpdate(parents[parentIndex]);
      
      toast.success('Secret passcode reset successfully');
      setNewPasscode('');
      setConfirmPasscode('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <CardTitle>Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={parent.name} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={parent.email} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={parent.phone} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Parent ID</Label>
              <Input value={parent.id} disabled className="bg-gray-50" />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Contact admin to update profile information
          </p>
        </CardContent>
      </Card>

      {/* Current Secret Passcode Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-green-600" />
            <CardTitle>Current Secret Passcode</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Your current secret passcode:</p>
            <p className="text-2xl tracking-wider bg-white px-4 py-2 rounded border inline-block">
              {parent.secretPasscode}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Use this passcode to access teacher chat. You can reset it below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reset Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-600" />
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
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={resetPassword}
          >
            <Lock className="h-4 w-4 mr-2" />
            Reset Password
          </Button>
        </CardContent>
      </Card>

      {/* Reset Secret Passcode */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-green-600" />
            <CardTitle>Reset Secret Passcode</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Your secret passcode is used to access teacher chat. Choose a memorable passcode.
          </p>

          <div className="space-y-2">
            <Label htmlFor="newPasscode">New Passcode</Label>
            <Input
              id="newPasscode"
              type="text"
              placeholder="Enter new passcode (min 4 characters)"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPasscode">Confirm New Passcode</Label>
            <Input
              id="confirmPasscode"
              type="text"
              placeholder="Confirm new passcode"
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={resetPasscode}
          >
            <Key className="h-4 w-4 mr-2" />
            Reset Secret Passcode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
