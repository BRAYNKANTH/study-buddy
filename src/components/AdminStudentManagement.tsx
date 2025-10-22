import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Search, Users, Download } from 'lucide-react';
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
import { Progress } from './ui/progress';

export default function AdminStudentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const parents = JSON.parse(localStorage.getItem('parents') || '[]');
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const marks = JSON.parse(localStorage.getItem('marks') || '[]');
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

  const subjects = ['English', 'Tamil', 'Mathematics'];

  // Apply filters
  const filteredStudents = students.filter((student: any) => {
    const gradeMatch = filterGrade === 'all' || student.grade === parseInt(filterGrade);
    const subjectMatch = filterSubject === 'all' || student.subjects.includes(filterSubject);
    const searchMatch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());

    return gradeMatch && subjectMatch && searchMatch;
  });

  // Calculate attendance percentage for a student
  const getAttendancePercentage = (studentId: string) => {
    const studentAttendance = attendance.filter((a: any) => a.studentId === studentId);
    const presentCount = studentAttendance.filter((a: any) => a.status === 'Present').length;
    const total = studentAttendance.length;
    return total > 0 ? Math.round((presentCount / total) * 100) : 0;
  };

  // Get payment status for a student
  const getPaymentStatus = (studentId: string) => {
    const studentPayments = payments.filter((p: any) => p.studentId === studentId);
    const pendingCount = studentPayments.filter((p: any) => p.status === 'Pending Approval').length;
    const approvedCount = studentPayments.filter((p: any) => p.status === 'Approved').length;
    
    if (pendingCount > 0) return { status: 'Pending', variant: 'secondary' as const };
    if (approvedCount > 0) return { status: 'Paid', variant: 'default' as const };
    return { status: 'Not Paid', variant: 'destructive' as const };
  };

  // Get assigned teachers
  const getAssignedTeachers = (subjects: string[]) => {
    return subjects
      .map((subject) => {
        const teacher = teachers.find((t: any) => t.subject === subject);
        return teacher ? teacher.name : 'N/A';
      })
      .join(', ');
  };

  // View student profile
  const viewStudentProfile = (student: any) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  // Get detailed student information
  const getStudentDetails = (studentId: string) => {
    const studentAttendance = attendance.filter((a: any) => a.studentId === studentId);
    const studentMarks = marks.filter((m: any) => m.studentId === studentId);
    const studentPayments = payments.filter((p: any) => p.studentId === studentId);
    const parent = parents.find((p: any) => p.id === students.find((s: any) => s.id === studentId)?.parentId);

    return { attendance: studentAttendance, marks: studentMarks, payments: studentPayments, parent };
  };

  const studentDetails = selectedStudent ? getStudentDetails(selectedStudent.id) : null;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grade 6</p>
                <p className="text-2xl">{students.filter((s: any) => s.grade === 6).length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grade 7</p>
                <p className="text-2xl">{students.filter((s: any) => s.grade === 7).length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grade 8</p>
                <p className="text-2xl">{students.filter((s: any) => s.grade === 8).length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="6">Grade 6</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Subject" />
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

          {/* Students Table */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Assigned Teacher(s)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: any) => {
                    const attendancePercentage = getAttendancePercentage(student.id);
                    const paymentStatus = getPaymentStatus(student.id);
                    const assignedTeachers = getAssignedTeachers(student.subjects);

                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p>{student.name}</p>
                            <p className="text-xs text-gray-500">{student.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Grade {student.grade}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={attendancePercentage} className="w-20" />
                            <span className="text-sm">{attendancePercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={paymentStatus.variant}>{paymentStatus.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{assignedTeachers}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewStudentProfile(student)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile - {selectedStudent?.name}</DialogTitle>
            <DialogDescription>Complete student information and records</DialogDescription>
          </DialogHeader>

          {selectedStudent && studentDetails && (
            <div className="space-y-6 mt-4">
              {/* Personal Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p>{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p>{selectedStudent.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p>Grade {selectedStudent.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subjects</p>
                  <p>{selectedStudent.subjects.join(', ')}</p>
                </div>
              </div>

              {/* Parent Info */}
              {studentDetails.parent && (
                <div className="border rounded-lg p-4">
                  <h4 className="mb-3">Parent Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p>{studentDetails.parent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm">{studentDetails.parent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p>{studentDetails.parent.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Records */}
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Attendance Records</h4>
                {studentDetails.attendance.length === 0 ? (
                  <p className="text-sm text-gray-500">No attendance records</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {studentDetails.attendance
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((record: any) => (
                        <div key={record.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                          <span>{new Date(record.date).toLocaleDateString()} - {record.subject}</span>
                          <Badge variant={record.status === 'Present' ? 'default' : 'destructive'}>
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Payment History</h4>
                {studentDetails.payments.length === 0 ? (
                  <p className="text-sm text-gray-500">No payment records</p>
                ) : (
                  <div className="space-y-2">
                    {studentDetails.payments.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <p>{payment.month} - Rs. {payment.amount?.toFixed(2) || '0.00'}</p>
                          <p className="text-xs text-gray-500">{payment.reference}</p>
                        </div>
                        <Badge
                          variant={
                            payment.status === 'Approved'
                              ? 'default'
                              : payment.status === 'Rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Marks */}
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Academic Performance</h4>
                {studentDetails.marks.length === 0 ? (
                  <p className="text-sm text-gray-500">No marks uploaded</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {studentDetails.marks.map((mark: any) => (
                      <div key={mark.id} className="border rounded p-3">
                        <p className="text-sm text-gray-600">{mark.subject}</p>
                        <p className="text-xl">{mark.marks}/100</p>
                        <p className="text-sm text-gray-500">{mark.term}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
