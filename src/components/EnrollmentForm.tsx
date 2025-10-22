import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Upload, X, ArrowLeft } from 'lucide-react';
import QRCode from 'qrcode';

interface EnrollmentFormProps {
  parent: any;
  onSuccess: () => void;
  onBack?: () => void;
}

export default function EnrollmentForm({ parent, onSuccess, onBack }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    subjects: [] as string[],
    paymentReference: '',
    paymentReceipt: null as string | null,
    receiptFileName: ''
  });

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF files are allowed');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        paymentReceipt: reader.result as string,
        receiptFileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setFormData(prev => ({
      ...prev,
      paymentReceipt: null,
      receiptFileName: ''
    }));
  };

  const generateQRCode = async (studentData: any) => {
    const qrData = {
      id: studentData.id,
      name: studentData.name,
      grade: studentData.grade,
      timestamp: new Date().toISOString()
    };
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataUrl;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  };

  const handleEnroll = async () => {
    // Validation
    if (!formData.studentName || !formData.grade || formData.subjects.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.paymentReference || !formData.paymentReceipt) {
      toast.error('Please provide payment reference and upload receipt');
      return;
    }

    // Create student
    const studentId = `S${Date.now()}`;
    const studentData = {
      id: studentId,
      name: formData.studentName,
      grade: parseInt(formData.grade),
      subjects: formData.subjects,
      parentId: parent.id,
      enrolledDate: new Date().toISOString()
    };

    // Generate QR code
    const qrCode = await generateQRCode(studentData);
    const studentWithQR = { ...studentData, qrCode };

    // Save student
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push(studentWithQR);
    localStorage.setItem('students', JSON.stringify(students));

    // Create payment record
    const payment = {
      id: `PAY${Date.now()}`,
      studentId: studentId,
      studentName: formData.studentName,
      parentId: parent.id,
      parentName: parent.name,
      reference: formData.paymentReference,
      receipt: formData.paymentReceipt,
      receiptFileName: formData.receiptFileName,
      status: 'Pending Approval',
      submittedDate: new Date().toISOString()
    };

    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    payments.push(payment);
    localStorage.setItem('payments', JSON.stringify(payments));

    // Create notification for admin
    const notification = {
      id: `N${Date.now()}`,
      type: 'payment',
      title: 'New Payment Submitted',
      message: `${parent.name} has submitted payment for ${formData.studentName}`,
      timestamp: new Date().toISOString(),
      read: false,
      targetRole: 'admin'
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Student enrolled successfully! Payment is pending approval.');
    
    // Reset form
    setFormData({
      studentName: '',
      grade: '',
      subjects: [],
      paymentReference: '',
      paymentReceipt: null,
      receiptFileName: ''
    });

    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Enroll New Student</CardTitle>
        </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            placeholder="Enter student's full name"
            value={formData.studentName}
            onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
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
          <Label>Select Subjects *</Label>
          <div className="space-y-3 border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="english"
                checked={formData.subjects.includes('English')}
                onCheckedChange={(checked) => handleSubjectChange('English', checked as boolean)}
              />
              <label htmlFor="english" className="text-sm cursor-pointer">
                English (Teacher: Sarah Williams)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tamil"
                checked={formData.subjects.includes('Tamil')}
                onCheckedChange={(checked) => handleSubjectChange('Tamil', checked as boolean)}
              />
              <label htmlFor="tamil" className="text-sm cursor-pointer">
                Tamil (Teacher: Kumar Raj)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mathematics"
                checked={formData.subjects.includes('Mathematics')}
                onCheckedChange={(checked) => handleSubjectChange('Mathematics', checked as boolean)}
              />
              <label htmlFor="mathematics" className="text-sm cursor-pointer">
                Mathematics (Teacher: David Chen)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="history"
                checked={formData.subjects.includes('History')}
                onCheckedChange={(checked) => handleSubjectChange('History', checked as boolean)}
              />
              <label htmlFor="history" className="text-sm cursor-pointer">
                History (Teacher: Nimal Perera)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="science"
                checked={formData.subjects.includes('Science')}
                onCheckedChange={(checked) => handleSubjectChange('Science', checked as boolean)}
              />
              <label htmlFor="science" className="text-sm cursor-pointer">
                Science (Teacher: Dr. Samantha Silva)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="geography"
                checked={formData.subjects.includes('Geography')}
                onCheckedChange={(checked) => handleSubjectChange('Geography', checked as boolean)}
              />
              <label htmlFor="geography" className="text-sm cursor-pointer">
                Geography (Teacher: Rajiv Fernando)
              </label>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-4">Payment Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentReference">Payment Reference Number *</Label>
              <Input
                id="paymentReference"
                placeholder="Enter payment reference number"
                value={formData.paymentReference}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentReference: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Upload Payment Receipt *</Label>
              <p className="text-xs text-gray-500 mb-2">
                Supported formats: JPG, PNG, PDF (Max 5MB)
              </p>
              
              {!formData.paymentReceipt ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <label htmlFor="receipt" className="cursor-pointer">
                    <span className="text-indigo-600 hover:text-indigo-700">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </label>
                  <input
                    id="receipt"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded">
                      <Upload className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm">{formData.receiptFileName}</p>
                      <p className="text-xs text-gray-500">Upload successful</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeReceipt}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your payment will be marked as "Pending Approval" until the admin verifies and approves it.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button className="flex-1" onClick={handleEnroll}>
            Enroll Student
          </Button>
          <Button variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
