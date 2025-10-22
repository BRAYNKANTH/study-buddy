import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, FileText, Filter, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface ViewMaterialsProps {
  student: any;
  onBack?: () => void;
}

export default function ViewMaterials({ student, onBack }: ViewMaterialsProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const materials = JSON.parse(localStorage.getItem('studyMaterials') || '[]');
  
  const filteredMaterials = materials.filter((m: any) => {
    const gradeMatch = m.grade === student.grade;
    const subjectMatch = student.subjects.includes(m.subject);
    const filterMatch = selectedSubject === 'all' || m.subject === selectedSubject;
    return gradeMatch && subjectMatch && filterMatch;
  });

  const downloadMaterial = (material: any) => {
    if (material.fileData) {
      const link = document.createElement('a');
      link.href = material.fileData;
      link.download = material.fileName;
      link.click();
      toast.success('Material downloaded');
    } else {
      toast.error('File not available');
    }
  };

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
            <CardTitle>Study Materials</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No study materials available yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your teachers will upload materials here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMaterials.map((material: any) => (
                <div
                  key={material.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        <h3>{material.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                          {material.subject}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          Grade {material.grade}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {material.fileName.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>

                      {material.description && (
                        <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                      )}

                      <div className="text-xs text-gray-500">
                        Uploaded by {material.uploadedBy} on{' '}
                        {new Date(material.uploadDate).toLocaleDateString()}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => downloadMaterial(material)}
                      className="ml-4"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
