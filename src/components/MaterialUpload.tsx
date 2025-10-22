import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface MaterialUploadProps {
  teacher: any;
}

export default function MaterialUpload({ teacher }: MaterialUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    grade: '',
    description: '',
    file: null as string | null,
    fileName: '',
    fileType: ''
  });

  const [materials, setMaterials] = useState<any[]>(
    JSON.parse(localStorage.getItem('studyMaterials') || '[]')
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Check file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Only PDF, DOC, DOCX, TXT, JPG, or PNG files are allowed');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        file: reader.result as string,
        fileName: file.name,
        fileType: file.type
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      fileName: '',
      fileType: ''
    }));
  };

  const handleUpload = () => {
    if (!formData.title || !formData.grade || !formData.file) {
      toast.error('Please fill in all required fields and upload a file');
      return;
    }

    const newMaterial = {
      id: `M${Date.now()}`,
      title: formData.title,
      subject: teacher.subject,
      grade: parseInt(formData.grade),
      description: formData.description,
      uploadedBy: teacher.name,
      uploadDate: new Date().toISOString(),
      fileName: formData.fileName,
      fileType: formData.fileType,
      fileData: formData.file
    };

    const updated = [...materials, newMaterial];
    setMaterials(updated);
    localStorage.setItem('studyMaterials', JSON.stringify(updated));

    // Create notifications for students
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const affectedStudents = students.filter(
      (s: any) => s.grade === parseInt(formData.grade) && s.subjects.includes(teacher.subject)
    );

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    affectedStudents.forEach((student: any) => {
      notifications.push({
        id: `N${Date.now()}_${student.id}`,
        type: 'material',
        title: 'New Study Material',
        message: `${teacher.name} uploaded "${formData.title}" for ${teacher.subject}`,
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: 'student',
        targetId: student.id
      });
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Study material uploaded successfully!');
    
    // Reset form
    setFormData({
      title: '',
      grade: '',
      description: '',
      file: null,
      fileName: '',
      fileType: ''
    });
  };

  const myMaterials = materials.filter(m => m.subject === teacher.subject);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Study Material</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Material Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Grammar Basics, Chapter 1 Notes"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade *</Label>
            <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes or instructions"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload File *</Label>
            <p className="text-xs text-gray-500 mb-2">
              Supported: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
            </p>
            
            {!formData.file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <label htmlFor="materialFile" className="cursor-pointer">
                  <span className="text-indigo-600 hover:text-indigo-700">
                    Click to upload file
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                </label>
                <input
                  id="materialFile"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">{formData.fileName}</p>
                    <p className="text-xs text-gray-500">Ready to upload</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              This material will be shared with all students in Grade {formData.grade || '___'} taking {teacher.subject}
            </p>
          </div>

          <Button className="w-full" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Material
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Uploaded Materials ({myMaterials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {myMaterials.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No materials uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {myMaterials.map((material) => (
                <div key={material.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4>{material.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Grade {material.grade} • {material.subject}
                      </p>
                      {material.description && (
                        <p className="text-sm text-gray-500 mt-2">{material.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Uploaded on {new Date(material.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-gray-400" />
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
