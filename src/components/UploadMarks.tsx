import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface UploadMarksProps {
  teacher: any;
}

export default function UploadMarks({ teacher }: UploadMarksProps) {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [marks, setMarks] = useState<{ [key: string]: string }>({});

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const eligibleStudents = students.filter(
    (s: any) => selectedGrade && s.grade === parseInt(selectedGrade) && s.subjects.includes(teacher.subject)
  );

  const handleMarkChange = (studentId: string, value: string) => {
    // Validate marks (0-100)
    const numValue = parseInt(value);
    if (value && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      return;
    }
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = () => {
    if (!selectedGrade || !selectedTerm) {
      toast.error('Please select grade and term');
      return;
    }

    if (Object.keys(marks).length === 0) {
      toast.error('Please enter marks for at least one student');
      return;
    }

    // Validate all marks
    for (const mark of Object.values(marks)) {
      if (mark && (parseInt(mark) < 0 || parseInt(mark) > 100)) {
        toast.error('Marks must be between 0 and 100');
        return;
      }
    }

    const allMarks = JSON.parse(localStorage.getItem('marks') || '[]');
    
    Object.entries(marks).forEach(([studentId, mark]) => {
      if (mark) {
        // Check if marks already exist for this student/subject/term
        const existingIndex = allMarks.findIndex(
          (m: any) =>
            m.studentId === studentId &&
            m.subject === teacher.subject &&
            m.term === selectedTerm
        );

        const markEntry = {
          id: `MRK${Date.now()}_${studentId}`,
          studentId,
          subject: teacher.subject,
          term: selectedTerm,
          marks: parseInt(mark),
          uploadedBy: teacher.name,
          uploadDate: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          // Update existing
          allMarks[existingIndex] = markEntry;
        } else {
          // Add new
          allMarks.push(markEntry);
        }

        // Create notification for student
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.push({
          id: `N${Date.now()}_${studentId}`,
          type: 'marks',
          title: 'New Marks Uploaded',
          message: `${teacher.name} uploaded marks for ${teacher.subject} - ${selectedTerm}`,
          timestamp: new Date().toISOString(),
          read: false,
          targetRole: 'student',
          targetId: studentId
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
    });

    localStorage.setItem('marks', JSON.stringify(allMarks));
    toast.success(`Marks uploaded successfully for ${Object.keys(marks).length} students!`);
    
    // Reset
    setMarks({});
  };

  const getGrade = (mark: number) => {
    if (mark >= 90) return 'A+';
    if (mark >= 80) return 'A';
    if (mark >= 70) return 'B+';
    if (mark >= 60) return 'B';
    if (mark >= 50) return 'C';
    if (mark >= 40) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Marks - {teacher.subject}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Term</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                  <SelectItem value="Final">Final Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedGrade && selectedTerm && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Uploading marks for Grade {selectedGrade} - {selectedTerm} ({eligibleStudents.length} students)
                </p>
              </div>

              {eligibleStudents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No students found for Grade {selectedGrade} taking {teacher.subject}
                </p>
              ) : (
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm">Student Name</th>
                          <th className="px-4 py-3 text-left text-sm">Student ID</th>
                          <th className="px-4 py-3 text-left text-sm">Marks (0-100)</th>
                          <th className="px-4 py-3 text-left text-sm">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {eligibleStudents.map((student: any) => {
                          const currentMark = marks[student.id] || '';
                          const grade = currentMark ? getGrade(parseInt(currentMark)) : '-';
                          
                          return (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">{student.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{student.id}</td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="Enter marks"
                                  value={currentMark}
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                  className="w-32"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-sm ${
                                  grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-700' :
                                  grade === 'B+' || grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                  grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                  grade === 'D' || grade === 'F' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm mb-2">Grading Scale:</p>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-2 text-xs">
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded">A+: 90-100</div>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded">A: 80-89</div>
                      <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded">B+: 70-79</div>
                      <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded">B: 60-69</div>
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">C: 50-59</div>
                      <div className="bg-red-100 text-red-700 px-2 py-1 rounded">D: 40-49</div>
                      <div className="bg-red-100 text-red-700 px-2 py-1 rounded">F: 0-39</div>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleSubmit}>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Marks
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
