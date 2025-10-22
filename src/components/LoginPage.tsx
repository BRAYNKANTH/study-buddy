import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { initializeMockData, teachers, adminUser } from '../lib/mockData';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onNavigateToRegister, onBack }: LoginPageProps) {
  const [role, setRole] = useState<string>('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    initializeMockData();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (role === 'admin') {
      if (email === adminUser.email && password === adminUser.password) {
        onLogin({ ...adminUser, role: 'admin' });
        toast.success('Welcome Admin!');
      } else {
        toast.error('Invalid admin credentials');
      }
    } else if (role === 'teacher') {
      const teacher = teachers.find(t => t.email === email && t.password === password);
      if (teacher) {
        onLogin({ ...teacher, role: 'teacher' });
        toast.success(`Welcome ${teacher.name}!`);
      } else {
        toast.error('Invalid teacher credentials');
      }
    } else if (role === 'parent') {
      const parents = JSON.parse(localStorage.getItem('parents') || '[]');
      const parent = parents.find((p: any) => p.email === email && p.password === password);
      if (parent) {
        onLogin({ ...parent, role: 'parent' });
        toast.success(`Welcome ${parent.name}!`);
      } else {
        toast.error('Invalid parent credentials');
      }
    }
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
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-3 rounded-full shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600" onClick={handleLogin}>
            Sign In
          </Button>

          {role === 'parent' && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onNavigateToRegister}
                  className="text-indigo-600 hover:underline"
                >
                  Register as Parent
                </button>
              </p>
            </div>
          )}

          <div className="pt-4 border-t mt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@tuition.com / admin123</p>
              <p><strong>Teacher:</strong> sarah.williams@tuition.com / teacher123</p>
              <p><strong>Parent:</strong> Register a new account</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
