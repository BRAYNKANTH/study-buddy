import { useState } from 'react';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Upload, 
  ClipboardList, 
  QrCode, 
  MessageSquare,
  Bell,
  LogOut,
  Users,
  BarChart3,
  Settings,
  Megaphone
} from 'lucide-react';
import MaterialUpload from './MaterialUpload';
import UploadMarks from './UploadMarks';
import ScanAttendance from './ScanAttendance';
import TeacherChatEnhanced from './TeacherChatEnhanced';
import TeacherNotifications from './TeacherNotifications';
import TeacherStudentManagement from './TeacherStudentManagement';
import TeacherAttendanceOverview from './TeacherAttendanceOverview';
import TeacherAccountSettings from './TeacherAccountSettings';
import AnnouncementsEnhanced from './AnnouncementsEnhanced';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TeacherDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const myStudents = students.filter((s: any) => s.subjects.includes(user.subject));
  const materials = JSON.parse(localStorage.getItem('studyMaterials') || '[]');
  const myMaterials = materials.filter((m: any) => m.subject === user.subject);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl text-gray-900">Teacher Dashboard</h1>
              <p className="text-sm text-gray-600">
                {user.name} - {user.subject} Teacher
              </p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'students'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Students
            </button>
            <button
              onClick={() => setActiveTab('attendance-overview')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'attendance-overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Attendance Overview
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Upload Materials
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'marks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ClipboardList className="h-4 w-4 inline mr-2" />
              Upload Marks
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <QrCode className="h-4 w-4 inline mr-2" />
              Scan Attendance
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Parent Chat
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Megaphone className="h-4 w-4 inline mr-2" />
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">My Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{myStudents.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Students taking {user.subject}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">Study Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{myMaterials.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Materials uploaded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{user.subject}</div>
                  <p className="text-xs text-gray-500 mt-1">Teaching</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Students by Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[6, 7, 8].map(grade => {
                    const gradeStudents = myStudents.filter((s: any) => s.grade === grade);
                    return (
                      <div key={grade} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Grade {grade}</span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {gradeStudents.length} students
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {gradeStudents.slice(0, 8).map((student: any) => (
                            <div key={student.id} className="text-sm text-gray-600 truncate">
                              {student.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && <TeacherStudentManagement teacher={user} />}
        {activeTab === 'attendance-overview' && <TeacherAttendanceOverview teacher={user} />}
        {activeTab === 'materials' && <MaterialUpload teacher={user} />}
        {activeTab === 'marks' && <UploadMarks teacher={user} />}
        {activeTab === 'attendance' && <ScanAttendance teacher={user} />}
        {activeTab === 'chat' && <TeacherChatEnhanced teacher={user} />}
        {activeTab === 'announcements' && <AnnouncementsEnhanced user={user} userRole="teacher" />}
        {activeTab === 'notifications' && <TeacherNotifications teacher={user} />}
        {activeTab === 'settings' && <TeacherAccountSettings teacher={user} onUpdate={(updated) => console.log('Teacher updated', updated)} />}
      </div>
    </div>
  );
}
