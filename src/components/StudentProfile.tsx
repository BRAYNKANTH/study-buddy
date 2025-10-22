import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, Printer, User, QrCode as QrIcon, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface StudentProfileProps {
  student: any;
  parent: any;
  onBack?: () => void;
}

export default function StudentProfile({ student, parent, onBack }: StudentProfileProps) {
  const downloadQR = () => {
    if (student.qrCode) {
      const link = document.createElement('a');
      link.href = student.qrCode;
      link.download = `${student.name}_QR_Code.png`;
      link.click();
      toast.success('QR Code downloaded');
    }
  };

  const printQR = () => {
    if (student.qrCode) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Student QR Code - ${student.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 40px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .qr-container {
                  border: 2px solid #000;
                  padding: 20px;
                  text-align: center;
                }
                img {
                  max-width: 300px;
                }
                @media print {
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Tuition Management System</h1>
                <h2>Student Attendance QR Code</h2>
              </div>
              <div class="qr-container">
                <img src="${student.qrCode}" alt="QR Code" />
                <h3>${student.name}</h3>
                <p>Student ID: ${student.id}</p>
                <p>Grade: ${student.grade}</p>
              </div>
              <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px;">Print</button>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const qrData = JSON.stringify({
    id: student.id,
    name: student.name,
    grade: student.grade,
    timestamp: new Date(student.enrolledDate).toISOString()
  });

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
            <User className="h-5 w-5 text-indigo-600" />
            <CardTitle>Student Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="text-lg">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p>{student.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <p>Grade {student.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrolled Subjects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.subjects.map((subject: string) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrollment Date</p>
                <p>{new Date(student.enrolledDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Parent Information</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Parent Name</p>
                    <p>{parent.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm">{parent.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p>{parent.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrIcon className="h-5 w-5 text-indigo-600" />
              <CardTitle>Attendance QR Code</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={downloadQR}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={printQR}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {student.qrCode ? (
              <>
                <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                  <img
                    src={student.qrCode}
                    alt="Student QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Scan this QR code for attendance marking
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Student ID: {student.id} | Grade: {student.grade}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <QrIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">QR Code not available</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
              <p className="text-sm text-blue-900 mb-2">
                <strong>How to use:</strong>
              </p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Download or print this QR code</li>
                <li>Bring it to class for attendance</li>
                <li>Teacher will scan it to mark your attendance</li>
                <li>You can view your attendance history in the Attendance tab</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg w-full">
              <p className="text-xs text-gray-600 mb-1">QR Code Data:</p>
              <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                {qrData}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
