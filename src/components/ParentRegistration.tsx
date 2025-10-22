import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface ParentRegistrationProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function ParentRegistration({ onSuccess, onBack }: ParentRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    secretPasscode: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.secretPasscode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.secretPasscode.length < 4) {
      toast.error('Secret passcode must be at least 4 characters');
      return;
    }

    // Check if email already exists
    const parents = JSON.parse(localStorage.getItem('parents') || '[]');
    if (parents.some((p: any) => p.email === formData.email)) {
      toast.error('Email already registered');
      return;
    }

    // Check if passcode already exists
    if (parents.some((p: any) => p.secretPasscode === formData.secretPasscode)) {
      toast.error('Secret passcode already taken. Please choose another one.');
      return;
    }

    // Create new parent
    const newParent = {
      id: `P${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      secretPasscode: formData.secretPasscode,
      registeredDate: new Date().toISOString()
    };

    parents.push(newParent);
    localStorage.setItem('parents', JSON.stringify(parents));

    toast.success('Registration successful! Please log in.');
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <Card className="w-full shadow-xl border-2">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-3 rounded-full shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Parent Registration</CardTitle>
            <CardDescription className="text-center">
              Create an account to enroll your children
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., +94 77 123 4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretPasscode">Secret Passcode</Label>
            <Input
              id="secretPasscode"
              type="text"
              placeholder="Create a unique passcode for teacher chat (min 4 chars)"
              value={formData.secretPasscode}
              onChange={(e) => handleChange('secretPasscode', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This passcode will be used for secure communication with teachers
            </p>
          </div>

          <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600" onClick={handleRegister}>
            Register
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
