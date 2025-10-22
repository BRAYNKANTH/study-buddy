import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

interface TeacherAttendanceOverviewProps {
  teacher: any;
}

export default function TeacherAttendanceOverview({ teacher }: TeacherAttendanceOverviewProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

  // Filter students for this teacher
  const myStudents = students.filter((s: any) => s.subjects.includes(teacher.subject));

  // Filter attendance records
  const myAttendance = attendance.filter((a: any) => a.subject === teacher.subject);

  // Apply filters
  const filteredAttendance = myAttendance.filter((record: any) => {
    const student = students.find((s: any) => s.id === record.studentId);
    if (!student) return false;

    const gradeMatch = selectedGrade === 'all' || student.grade === parseInt(selectedGrade);
    const dateMatch = !selectedDate || record.date === selectedDate;
    const searchMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return gradeMatch && dateMatch && searchMatch;
  });

  // Calculate statistics
  const totalSessions = new Set(myAttendance.map((a: any) => a.date)).size;
  const presentCount = myAttendance.filter((a: any) => a.status === 'Present').length;
  const absentCount = myAttendance.filter((a: any) => a.status === 'Absent').length;
  const overallPercentage = myAttendance.length > 0 
    ? Math.round((presentCount / myAttendance.length) * 100) 
    : 0;

  // Get student-wise attendance summary
  const studentSummary = myStudents.map((student: any) => {
    const studentRecords = myAttendance.filter((a: any) => a.studentId === student.id);
    const present = studentRecords.filter((a: any) => a.status === 'Present').length;
    const total = studentRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      ...student,
      presentCount: present,
      totalSessions: total,
      percentage
    };
  }).filter((s: any) => {
    const gradeMatch = selectedGrade === 'all' || s.grade === parseInt(selectedGrade);
    const searchMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return gradeMatch && searchMatch;
  });

  // Group attendance by date
  const attendanceByDate = filteredAttendance.reduce((acc: any, record: any) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {});

  const dates = Object.keys(attendanceByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl">{totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl">{presentCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl">{absentCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall %</p>
                <p className="text-2xl">{overallPercentage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
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
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Student-wise Summary */}
          <div className="border rounded-lg p-4">
            <h4 className="mb-4">Student Attendance Summary</h4>
            {studentSummary.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No students found</p>
            ) : (
              <div className="space-y-3">
                {studentSummary.map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p>{student.name}</p>
                      <p className="text-sm text-gray-600">
                        Grade {student.grade} • {student.presentCount}/{student.totalSessions} sessions
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={student.percentage} className="w-24" />
                      <Badge
                        variant={
                          student.percentage >= 75 ? 'default' :
                          student.percentage >= 50 ? 'secondary' :
                          'destructive'
                        }
                      >
                        {student.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date-wise Logs */}
          {dates.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="mb-4">Attendance by Date</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {dates.map((date) => (
                  <div key={date} className="border-l-4 border-indigo-500 pl-4">
                    <p className="mb-2">{new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <div className="space-y-2">
                      {attendanceByDate[date].map((record: any) => {
                        const student = students.find((s: any) => s.id === record.studentId);
                        return (
                          <div key={record.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <span>{student?.name || 'Unknown'}</span>
                            <Badge variant={record.status === 'Present' ? 'default' : 'destructive'}>
                              {record.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
