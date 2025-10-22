import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';

interface TimetableProps {
  student: any;
  onBack?: () => void;
}

export default function Timetable({ student, onBack }: TimetableProps) {
  const timetable = JSON.parse(localStorage.getItem('timetable') || '[]');
  
  // Filter timetable for student's grade and subjects
  const studentTimetable = timetable.filter(
    (entry: any) =>
      entry.grade === student.grade && student.subjects.includes(entry.subject)
  );

  // Group by day
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const groupedByDay = days.map((day) => ({
    day,
    entries: studentTimetable.filter((entry: any) => entry.day === day)
  }));

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
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <CardTitle>Weekly Timetable - Grade {student.grade}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupedByDay.map(({ day, entries }) => (
              <div key={day} className="border rounded-lg overflow-hidden">
                <div className="bg-indigo-50 px-4 py-2 border-b">
                  <h3>{day}</h3>
                </div>
                <div className="p-4">
                  {entries.length === 0 ? (
                    <p className="text-sm text-gray-500">No classes scheduled</p>
                  ) : (
                    <div className="space-y-3">
                      {entries.map((entry: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-indigo-600 text-white px-3 py-2 rounded text-sm">
                              {entry.time}
                            </div>
                            <div>
                              <p>{entry.subject}</p>
                              <p className="text-sm text-gray-600">{entry.teacher}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">Grade {entry.grade}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {studentTimetable.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No timetable available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
