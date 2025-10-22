import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Eye, Search, Users } from 'lucide-react';
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

interface TeacherStudentManagementProps {
  teacher: any;
}

export default function TeacherStudentManagement({ teacher }: TeacherStudentManagementProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  const marks = JSON.parse(localStorage.getItem('marks') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');

  // Filter students for this teacher
  const myStudents = students.filter((s: any) => s.subjects.includes(teacher.subject));

  // Apply filters
  const filteredStudents = myStudents.filter((student: any) => {
    const gradeMatch = selectedGrade === 'all' || student.grade === parseInt(selectedGrade);
    const searchMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return gradeMatch && searchMatch;
  });

  // Calculate attendance percentage
  const getAttendancePercentage = (studentId: string) => {
    const studentAttendance = attendance.filter(
      (a: any) => a.studentId === studentId && a.subject === teacher.subject
    );
    const presentCount = studentAttendance.filter((a: any) => a.status === 'Present').length;
    const total = studentAttendance.length;
    return total > 0 ? Math.round((presentCount / total) * 100) : 0;
  };

  // Get student details for modal
  const getStudentDetails = (studentId: string) => {
    const studentAttendance = attendance.filter(
      (a: any) => a.studentId === studentId && a.subject === teacher.subject
    );
    const studentMarks = marks.filter(
      (m: any) => m.studentId === studentId && m.subject === teacher.subject
    );
    const studentPayments = payments.filter((p: any) => p.studentId === studentId);
    
    return { attendance: studentAttendance, marks: studentMarks, payments: studentPayments };
  };

  const viewStudentProfile = (student: any) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const studentDetails = selectedStudent ? getStudentDetails(selectedStudent.id) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <CardTitle>Student Management - {teacher.subject}</CardTitle>
            </div>
            <Badge variant="secondary">{filteredStudents.length} students</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="6">Grade 6</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
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
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: any) => {
                    const attendancePercentage = getAttendancePercentage(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{student.id}</TableCell>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewStudentProfile(student)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
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
            <DialogDescription>
              Detailed information for {selectedStudent?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && studentDetails && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
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

              {/* QR Code */}
              {selectedStudent.qrCode && (
                <div className="border rounded-lg p-4">
                  <h4 className="mb-3">QR Code</h4>
                  <img
                    src={selectedStudent.qrCode}
                    alt="Student QR Code"
                    className="w-48 h-48 border"
                  />
                </div>
              )}

              {/* Attendance Records */}
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Attendance Records ({teacher.subject})</h4>
                {studentDetails.attendance.length === 0 ? (
                  <p className="text-sm text-gray-500">No attendance records</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {studentDetails.attendance
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record: any) => (
                        <div key={record.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                          <Badge variant={record.status === 'Present' ? 'default' : 'destructive'}>
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Marks */}
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Marks ({teacher.subject})</h4>
                {studentDetails.marks.length === 0 ? (
                  <p className="text-sm text-gray-500">No marks uploaded</p>
                ) : (
                  <div className="space-y-2">
                    {studentDetails.marks.map((mark: any) => (
                      <div key={mark.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <span>{mark.term}</span>
                        <span>{mark.marks}/100</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Payment Status</h4>
                {studentDetails.payments.length === 0 ? (
                  <p className="text-sm text-gray-500">No payment records</p>
                ) : (
                  <div className="space-y-2">
                    {studentDetails.payments.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <span>{payment.reference}</span>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
