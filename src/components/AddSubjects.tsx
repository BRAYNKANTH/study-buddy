import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddSubjectsProps {
  parent: any;
  onSuccess: () => void;
}

export default function AddSubjects({ parent, onSuccess }: AddSubjectsProps) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const myStudents = students.filter((s: any) => s.parentId === parent.id);

  const availableSubjects = ['English', 'Tamil', 'Mathematics'];

  const selectedStudentData = students.find((s: any) => s.id === selectedStudent);
  const currentSubjects = selectedStudentData?.subjects || [];
  const subjectsToAdd = availableSubjects.filter(
    (subject) => !currentSubjects.includes(subject)
  );

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const addSubjects = () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject to add');
      return;
    }

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const studentIndex = allStudents.findIndex((s: any) => s.id === selectedStudent);

    if (studentIndex !== -1) {
      const updatedSubjects = [
        ...allStudents[studentIndex].subjects,
        ...selectedSubjects,
      ];
      allStudents[studentIndex].subjects = updatedSubjects;
      localStorage.setItem('students', JSON.stringify(allStudents));

      // Create notification for admin
      const notification = {
        id: `N${Date.now()}`,
        type: 'enrollment',
        title: 'Subjects Added',
        message: `${parent.name} added ${selectedSubjects.join(', ')} for ${
          allStudents[studentIndex].name
        }`,
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: 'admin',
      };

      const notifications = JSON.parse(
        localStorage.getItem('notifications') || '[]'
      );
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));

      toast.success(
        `Successfully added ${selectedSubjects.join(', ')} for ${
          allStudents[studentIndex].name
        }`
      );
      setSelectedStudent('');
      setSelectedSubjects([]);
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-green-600" />
            <CardTitle>Add Additional Subjects</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              Enroll your student in additional subjects after initial enrollment
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Select Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {myStudents.map((student: any) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} (Grade {student.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudentData && (
            <>
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm mb-2">Currently Enrolled Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {currentSubjects.map((subject: string) => (
                    <Badge key={subject} variant="default">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {subjectsToAdd.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    {selectedStudentData.name} is already enrolled in all
                    available subjects!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm">Select Subjects to Add</label>
                    <div className="border rounded-lg p-4 space-y-3">
                      {subjectsToAdd.map((subject) => (
                        <div
                          key={subject}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={subject}
                            checked={selectedSubjects.includes(subject)}
                            onCheckedChange={() => toggleSubject(subject)}
                          />
                          <label htmlFor={subject} className="cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-green-600" />
                              <span>{subject}</span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSubjects.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        You are adding:{' '}
                        <strong>{selectedSubjects.join(', ')}</strong>
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={addSubjects}
                    disabled={selectedSubjects.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Selected Subjects
                  </Button>
                </>
              )}
            </>
          )}

          {!selectedStudentData && myStudents.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No enrolled students found</p>
              <p className="text-sm text-gray-400 mt-1">
                Please enroll a student first
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
