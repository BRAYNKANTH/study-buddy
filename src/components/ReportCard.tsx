import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FileText, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

interface ReportCardProps {
  student: any;
  onBack?: () => void;
}

export default function ReportCard({ student, onBack }: ReportCardProps) {
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  
  const allMarks = JSON.parse(localStorage.getItem('marks') || '[]');
  const studentMarks = allMarks.filter(
    (m: any) => m.studentId === student.id && m.term === selectedTerm
  );

  const getGradeInfo = (marks: number) => {
    if (marks >= 90) return { grade: 'A+', remark: 'Excellent', color: 'bg-green-100 text-green-700' };
    if (marks >= 80) return { grade: 'A', remark: 'Very Good', color: 'bg-green-100 text-green-700' };
    if (marks >= 70) return { grade: 'B+', remark: 'Good', color: 'bg-blue-100 text-blue-700' };
    if (marks >= 60) return { grade: 'B', remark: 'Above Average', color: 'bg-blue-100 text-blue-700' };
    if (marks >= 50) return { grade: 'C', remark: 'Average', color: 'bg-yellow-100 text-yellow-700' };
    if (marks >= 40) return { grade: 'D', remark: 'Below Average', color: 'bg-orange-100 text-orange-700' };
    return { grade: 'F', remark: 'Needs Improvement', color: 'bg-red-100 text-red-700' };
  };

  const totalMarks = studentMarks.reduce((sum: number, m: any) => sum + m.marks, 0);
  const averageMarks = studentMarks.length > 0 ? (totalMarks / studentMarks.length).toFixed(2) : 0;
  const overallGrade = studentMarks.length > 0 ? getGradeInfo(parseFloat(averageMarks.toString())) : null;

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
              <FileText className="h-5 w-5 text-indigo-600" />
              <CardTitle>Report Card - {student.name}</CardTitle>
            </div>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First Term">First Term</SelectItem>
                <SelectItem value="Second Term">Second Term</SelectItem>
                <SelectItem value="Third Term">Third Term</SelectItem>
                <SelectItem value="Final">Final Exam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {studentMarks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No marks available for {selectedTerm}</p>
              <p className="text-sm text-gray-400 mt-1">
                Marks will appear here once your teachers upload them
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600 mb-1">Total Marks</p>
                  <p className="text-2xl">{totalMarks}/{studentMarks.length * 100}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Average</p>
                  <p className="text-2xl">{averageMarks}%</p>
                </div>
                <div className={`${overallGrade?.color} p-4 rounded-lg`}>
                  <p className="text-sm mb-1">Overall Grade</p>
                  <p className="text-2xl">{overallGrade?.grade}</p>
                  <p className="text-xs mt-1">{overallGrade?.remark}</p>
                </div>
              </div>

              {/* Subject-wise marks */}
              <div className="space-y-3">
                <h3 className="text-sm">Subject-wise Performance</h3>
                {studentMarks.map((mark: any) => {
                  const gradeInfo = getGradeInfo(mark.marks);
                  const percentage = mark.marks;
                  
                  return (
                    <div key={mark.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4>{mark.subject}</h4>
                          <p className="text-sm text-gray-600">
                            Uploaded by {mark.uploadedBy}
                          </p>
                        </div>
                        <Badge className={gradeInfo.color}>
                          {gradeInfo.grade}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Marks Obtained</span>
                          <span>{mark.marks}/100</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 80 ? 'bg-green-600' :
                              percentage >= 60 ? 'bg-blue-600' :
                              percentage >= 40 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{gradeInfo.remark}</span>
                          <div className="flex items-center">
                            {percentage >= 75 ? (
                              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                            ) : percentage < 50 ? (
                              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            ) : null}
                            <span>{percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grading Scale */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm mb-3">Grading Scale</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-green-100 text-green-700 px-3 py-2 rounded">
                    <strong>A+ (90-100):</strong> Excellent
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-2 rounded">
                    <strong>A (80-89):</strong> Very Good
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded">
                    <strong>B+ (70-79):</strong> Good
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded">
                    <strong>B (60-69):</strong> Above Average
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded">
                    <strong>C (50-59):</strong> Average
                  </div>
                  <div className="bg-orange-100 text-orange-700 px-3 py-2 rounded">
                    <strong>D (40-49):</strong> Below Average
                  </div>
                  <div className="bg-red-100 text-red-700 px-3 py-2 rounded col-span-2">
                    <strong>F (0-39):</strong> Needs Improvement
                  </div>
                </div>
              </div>

              {/* Report Generated Date */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Report generated on {new Date().toLocaleDateString()} • {selectedTerm}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
