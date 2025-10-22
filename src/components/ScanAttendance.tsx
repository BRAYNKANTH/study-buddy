import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { QrCode, CheckCircle, Camera, X, Play, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import jsQR from 'jsqr';

interface ScanAttendanceProps {
  teacher: any;
}

export default function ScanAttendance({ teacher }: ScanAttendanceProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>(''); // ⏰ added time state
  const [sessionStartTime, setSessionStartTime] = useState<string>('');
  const [markedStudents, setMarkedStudents] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const eligibleStudents = students.filter(
    (s: any) =>
      selectedGrade &&
      s.grade === parseInt(selectedGrade) &&
      s.subjects.includes(teacher.subject)
  );

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startSession = () => {
    if (!selectedGrade) {
      toast.error('Please select a grade first');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select a time');
      return;
    }

    const fullDateTime = `${selectedDate}T${selectedTime}`;
    setSessionActive(true);
    setSessionStartTime(fullDateTime);
    setMarkedStudents([]);
    toast.success(
      `Attendance session started for Grade ${selectedGrade} - ${teacher.subject} at ${selectedTime}`
    );
  };

  const endSession = () => {
    stopCamera();
    setSessionActive(false);

    const presentCount = markedStudents.length;
    const absentCount = eligibleStudents.length - presentCount;

    toast.success(`Session ended. Present: ${presentCount}, Absent: ${absentCount}`);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setScanning(true);
        toast.success('Camera activated. Point at student QR code.');
        requestAnimationFrame(scanQRCode);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCameraActive(false);
    setScanning(false);
  };

  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleQRDetected(code.data);
        return;
      }
    }

    animationRef.current = requestAnimationFrame(scanQRCode);
  };

  const handleQRDetected = (qrData: string) => {
    if (!sessionActive) {
      toast.error('Please start a session first');
      return;
    }

    try {
      const data = JSON.parse(qrData);
      const student = students.find((s: any) => s.id === data.id);

      if (!student) {
        toast.error('Student not found');
        return;
      }

      if (student.grade !== parseInt(selectedGrade)) {
        toast.error('Student is not from the selected grade');
        return;
      }

      if (!student.subjects.includes(teacher.subject)) {
        toast.error(`Student is not enrolled in ${teacher.subject}`);
        return;
      }

      if (markedStudents.includes(student.id)) {
        toast.warning('Student already marked present');
        return;
      }

      const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
      const attendanceRecord = {
        id: `ATT${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        subject: teacher.subject,
        teacherId: teacher.id,
        date: selectedDate,
        status: 'Present',
        scannedAt: new Date().toISOString(),
        sessionStartTime: sessionStartTime,
      };

      attendance.push(attendanceRecord);
      localStorage.setItem('attendance', JSON.stringify(attendance));

      setMarkedStudents((prev) => [...prev, student.id]);
      toast.success(`✓ ${student.name} marked present!`, { duration: 2000 });

      setScanning(false);
      setTimeout(() => {
        setScanning(true);
        requestAnimationFrame(scanQRCode);
      }, 1500);
    } catch (error) {
      toast.error('Invalid QR code format');
    }
  };

  const markAbsent = (studentId: string) => {
    if (!sessionActive) {
      toast.error('Please start a session first');
      return;
    }

    const student = students.find((s: any) => s.id === studentId);
    if (!student) return;

    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const attendanceRecord = {
      id: `ATT${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      subject: teacher.subject,
      teacherId: teacher.id,
      date: selectedDate,
      status: 'Absent',
      markedAt: new Date().toISOString(),
      sessionStartTime: sessionStartTime,
    };

    attendance.push(attendanceRecord);
    localStorage.setItem('attendance', JSON.stringify(attendance));

    setMarkedStudents((prev) => [...prev, student.id]);
    toast.success(`${student.name} marked absent`);
  };

  const getAttendanceForSession = () => {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    return attendance.filter(
      (a: any) =>
        a.date === selectedDate &&
        a.subject === teacher.subject &&
        a.teacherId === teacher.id
    );
  };

  const sessionAttendance = getAttendanceForSession();

  return (
    <div className="space-y-6">
      {/* Session Control */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-indigo-600" />
              <span>QR Attendance Scanner - {teacher.subject}</span>
            </div>
            {sessionActive && (
              <span className="flex items-center space-x-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span>Session Active</span>
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Grade */}
            <div className="space-y-2">
              <Label>Select Grade *</Label>
              <Select
                value={selectedGrade}
                onValueChange={setSelectedGrade}
                disabled={sessionActive}
              >
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

            {/* Date */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={sessionActive}
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>Time *</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={sessionActive}
              />
            </div>

            {/* Eligible Students */}
            <div className="space-y-2">
              <Label>Eligible Students</Label>
              <div className="flex items-center h-10 px-3 bg-gray-100 rounded-lg">
                <span className="text-2xl text-gray-900">
                  {eligibleStudents.length}
                </span>
                <span className="ml-2 text-sm text-gray-600">students</span>
              </div>
            </div>
          </div>

          {/* Start/Stop Session Button */}
          {!sessionActive ? (
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
              onClick={startSession}
              size="lg"
              disabled={!selectedGrade || !selectedTime}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Attendance Session
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="destructive"
              onClick={endSession}
              size="lg"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              End Session
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
