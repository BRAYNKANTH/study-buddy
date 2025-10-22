import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus, Users, BookOpen, Mail, Phone, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export default function AdminTeacherManagement() {
  const [teachers, setTeachers] = useState<any[]>(
    JSON.parse(localStorage.getItem('teachers') || '[]')
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [password, setPassword] = useState('');

  const subjects = ['English', 'Tamil', 'Mathematics', 'History', 'Science', 'Geography'];
  const students = JSON.parse(localStorage.getItem('students') || '[]');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setPassword('');
    setShowPassword(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !subject || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Validate phone format
    if (!phone.match(/^\+94\s\d{2}\s\d{3}\s\d{4}$/)) {
      toast.error('Phone number must be in format: +94 XX XXX XXXX');
      return;
    }

    const allTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');

    // Check if email already exists
    const emailExists = allTeachers.some((t: any) => t.email === email);
    if (emailExists) {
      toast.error('Email already exists');
      return;
    }

    // Check if subject already has a teacher
    const subjectExists = allTeachers.some((t: any) => t.subject === subject);
    if (subjectExists) {
      toast.error(`${subject} already has a teacher assigned`);
      return;
    }

    const newTeacher = {
      id: `T${String(allTeachers.length + 1).padStart(3, '0')}`,
      name,
      email,
      phone,
      subject,
      password,
      createdDate: new Date().toISOString(),
      createdBy: 'Admin'
    };

    allTeachers.push(newTeacher);
    localStorage.setItem('teachers', JSON.stringify(allTeachers));
    setTeachers(allTeachers);
    toast.success(`Teacher ${name} added successfully!`);

    setShowAddModal(false);
    resetForm();
  };

  const confirmDelete = (teacher: any) => {
    setTeacherToDelete(teacher);
  };

  const deleteTeacher = () => {
    if (!teacherToDelete) return;

    const allTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const updatedTeachers = allTeachers.filter((t: any) => t.id !== teacherToDelete.id);
    
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
    setTeachers(updatedTeachers);
    toast.success(`Teacher ${teacherToDelete.name} deleted successfully`);
    setTeacherToDelete(null);
  };

  // Get student count for each subject
  const getStudentCount = (teacherSubject: string) => {
    return students.filter((s: any) => s.subjects.includes(teacherSubject)).length;
  };

  // Get available subjects for new teachers
  const getAvailableSubjects = () => {
    const assignedSubjects = teachers.map((t: any) => t.subject);
    return subjects.filter((s) => !assignedSubjects.includes(s));
  };

  const availableSubjects = getAvailableSubjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-gray-900">Teacher Management</h2>
          <p className="text-sm text-gray-600">Add and manage teachers</p>
        </div>
        <Button onClick={openAddModal} disabled={availableSubjects.length === 0}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Teacher
        </Button>
      </div>

      {availableSubjects.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            All subjects have been assigned to teachers. Delete a teacher to add a new one for that subject.
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl">{teachers.length}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Subjects</p>
                <p className="text-2xl">{teachers.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Slots</p>
                <p className="text-2xl">{availableSubjects.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No teachers added yet</p>
              <Button onClick={openAddModal}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Teacher
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <Badge variant="outline">{teacher.id}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{teacher.name}</p>
                          <p className="text-xs text-gray-500">
                            Added {new Date(teacher.createdDate || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gradient-to-r from-indigo-600 to-blue-500">
                          {teacher.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{teacher.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{teacher.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {getStudentCount(teacher.subject)} students
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(teacher)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Enter teacher details. Note: Teacher information cannot be edited after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter teacher's full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+94 XX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500">Format: +94 XX XXX XXXX</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableSubjects.length === 0 && (
                <p className="text-xs text-red-500">All subjects are assigned</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Teacher can change this password in their account settings
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Important:</strong> Teacher details cannot be edited after creation. 
                Please verify all information before submitting.
              </p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                Add Teacher
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!teacherToDelete} onOpenChange={() => setTeacherToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{teacherToDelete?.name}</strong> ({teacherToDelete?.subject})? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTeacher}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Teacher
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
