import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle, XCircle, Calendar, ArrowLeft } from 'lucide-react';

interface AttendanceTrackerProps {
  student: any;
  onBack?: () => void;
}

export default function AttendanceTracker({ student, onBack }: AttendanceTrackerProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());

  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  const studentAttendance = attendance.filter((a: any) => {
    const recordDate = new Date(a.date);
    const subjectMatch = selectedSubject === 'all' || a.subject === selectedSubject;
    const monthMatch = recordDate.getMonth() === parseInt(selectedMonth);
    return a.studentId === student.id && subjectMatch && monthMatch;
  });

  // Group by subject
  const attendanceBySubject = student.subjects.map((subject: string) => {
    const subjectRecords = studentAttendance.filter((a: any) => a.subject === subject);
    const presentCount = subjectRecords.filter((a: any) => a.status === 'Present').length;
    const totalCount = subjectRecords.length;
    const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

    return {
      subject,
      present: presentCount,
      total: totalCount,
      percentage
    };
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalPresent = studentAttendance.filter((a: any) => a.status === 'Present').length;
  const totalRecords = studentAttendance.length;
  const overallPercentage = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <CardTitle>Attendance Tracker</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {student.subjects.map((subject: string) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Days Present</p>
              <p className="text-2xl">{totalPresent}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Days</p>
              <p className="text-2xl">{totalRecords}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 mb-1">Attendance Rate</p>
              <p className="text-2xl">{overallPercentage}%</p>
            </div>
          </div>

          {/* Subject-wise attendance */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm">Subject-wise Attendance</h3>
            {attendanceBySubject.map((data) => (
              <div key={data.subject} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4>{data.subject}</h4>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    parseFloat(data.percentage.toString()) >= 75 
                      ? 'bg-green-100 text-green-700' 
                      : parseFloat(data.percentage.toString()) >= 50
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {data.percentage}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Present: {data.present} days</span>
                  <span>Total: {data.total} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      parseFloat(data.percentage.toString()) >= 75
                        ? 'bg-green-600'
                        : parseFloat(data.percentage.toString()) >= 50
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent attendance records */}
          <div>
            <h3 className="text-sm mb-3">Recent Attendance Records</h3>
            {studentAttendance.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records for {months[parseInt(selectedMonth)]}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {studentAttendance
                  .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((record: any) => (
                    <div
                      key={record.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        record.status === 'Present'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {record.status === 'Present' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="text-sm">{record.subject}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
