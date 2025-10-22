import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  UserPlus, 
  Calendar, 
  BookOpen, 
  ClipboardCheck,
  FileText,
  Bell,
  MessageSquare,
  DollarSign,
  User,
  LogOut,
  Settings,
  Plus,
  Menu,
  X,
  GraduationCap,
  Home
} from 'lucide-react';
import EnrollmentForm from './EnrollmentForm';
import Timetable from './Timetable';
import ViewMaterials from './ViewMaterials';
import AttendanceTracker from './AttendanceTracker';
import ReportCard from './ReportCard';
import ParentChatWithPasscode from './ParentChatWithPasscode';
import MonthlyPaymentSystem from './MonthlyPaymentSystem';
import StudentProfile from './StudentProfile';
import ParentNotifications from './ParentNotifications';
import ParentAccountSettings from './ParentAccountSettings';
import AddSubjects from './AddSubjects';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface ParentDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function ParentDashboard({ user, onLogout }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [user]);

  const loadStudents = () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const parentStudents = students.filter((s: any) => s.parentId === user.id);
    setMyStudents(parentStudents);
    if (parentStudents.length > 0 && !selectedStudent) {
      setSelectedStudent(parentStudents[0]);
    }
  };

  const handleEnrollmentSuccess = () => {
    loadStudents();
    setActiveTab('overview');
  };

  const navItems = [
    { id: 'overview', label: 'Home', icon: Home, color: 'from-blue-500 to-indigo-500', requiresStudent: false },
    { id: 'timetable', label: 'Timetable', icon: Calendar, color: 'from-purple-500 to-pink-500', requiresStudent: true },
    { id: 'materials', label: 'Materials', icon: BookOpen, color: 'from-green-500 to-emerald-500', requiresStudent: true },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, color: 'from-orange-500 to-red-500', requiresStudent: true },
    { id: 'reportcard', label: 'Report', icon: FileText, color: 'from-indigo-500 to-blue-500', requiresStudent: true },
    { id: 'payments', label: 'Payments', icon: DollarSign, color: 'from-green-500 to-teal-500', requiresStudent: false },
    { id: 'chat', label: 'Chat', icon: MessageSquare, color: 'from-pink-500 to-rose-500', requiresStudent: false },
    { id: 'notifications', label: 'Alerts', icon: Bell, color: 'from-yellow-500 to-orange-500', requiresStudent: false },
  ];

  const changeTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">Study-Buddy</h1>
              <p className="text-xs text-gray-600">{user.name}</p>
            </div>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {/* Student Selector in Menu */}
                {myStudents.length > 0 && (
                  <div className="pb-4 mb-4 border-b">
                    <p className="text-sm text-gray-600 mb-2">Select Student:</p>
                    <div className="space-y-2">
                      {myStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedStudent?.id === student.id
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-sm">{student.name}</div>
                          <div className="text-xs opacity-80">Grade {student.grade}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {myStudents.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => changeTab('enroll')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Enroll New Student
                  </Button>
                )}

                {myStudents.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => changeTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Student Profile
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => changeTab('addsubjects')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subjects
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => changeTab('settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Student Selector */}
        {myStudents.length > 0 && activeTab !== 'enroll' && (
          <div className="px-4 pb-3 overflow-x-auto">
            <div className="flex space-x-2">
              {myStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                    selectedStudent?.id === student.id
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {student.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-3 rounded-xl shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Parent Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {myStudents.length > 0 && (
                <>
                  <Button variant="outline" onClick={() => setActiveTab('enroll')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Enroll Student
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Desktop Student Selector */}
          {myStudents.length > 0 && activeTab !== 'enroll' && (
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Select Student:</span>
              <div className="flex space-x-2">
                {myStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`px-5 py-2.5 rounded-lg text-sm transition-all ${
                      selectedStudent?.id === student.id
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>{student.name}</div>
                    <div className="text-xs opacity-80">Grade {student.grade}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        {/* Overview with visual cards */}
        {activeTab === 'overview' && myStudents.length > 0 && selectedStudent && (
          <div className="space-y-6">
            {/* Hero Card */}
            <Card className="border-2 shadow-lg overflow-hidden">
              <div className="relative h-32 sm:h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
                </div>
                <div className="relative h-full flex items-center px-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl sm:text-3xl">{selectedStudent.name}</h2>
                      <p className="text-blue-100">Grade {selectedStudent.grade} • Student ID: {selectedStudent.id}</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl text-gray-900">{selectedStudent.subjects.length}</div>
                    <div className="text-xs text-gray-600">Subjects</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ClipboardCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl text-gray-900">90%</div>
                    <div className="text-xs text-gray-600">Attendance</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl text-gray-900">B+</div>
                    <div className="text-xs text-gray-600">Avg Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-2xl text-gray-900">18</div>
                    <div className="text-xs text-gray-600">Classes/Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {navItems.filter(item => item.requiresStudent || !item.requiresStudent).map((item) => (
                <Card 
                  key={item.id}
                  className="border-2 hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setActiveTab(item.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-gray-900">{item.label}</h3>
                    <p className="text-xs text-gray-600 mt-1">View details</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enrolled Subjects */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Enrolled Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {selectedStudent.subjects.map((subject: string) => {
                    const subjectIcons: any = {
                      'English': '📚',
                      'Tamil': '📝',
                      'Mathematics': '🔢',
                      'History': '🏛️',
                      'Science': '🔬',
                      'Geography': '🌍'
                    };
                    const subjectColors: any = {
                      'English': 'from-blue-500 to-blue-600',
                      'Tamil': 'from-orange-500 to-orange-600',
                      'Mathematics': 'from-green-500 to-green-600',
                      'History': 'from-purple-500 to-purple-600',
                      'Science': 'from-pink-500 to-pink-600',
                      'Geography': 'from-indigo-500 to-indigo-600'
                    };
                    return (
                      <div key={subject} className={`bg-gradient-to-br ${subjectColors[subject]} rounded-xl p-4 text-center text-white shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="text-3xl mb-1">{subjectIcons[subject]}</div>
                        <div className="text-sm">{subject}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'overview' && myStudents.length === 0 && (
          <Card className="border-2 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="max-w-md mx-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1639548538099-6f7f9aec3b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2MTA2MDg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Students learning"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <UserPlus className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">Welcome to Study-Buddy!</h3>
                <p className="text-gray-600 mb-6">Get started by enrolling your first student</p>
                <Button 
                  onClick={() => setActiveTab('enroll')}
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
                  size="lg"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Enroll Your First Student
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'enroll' && <EnrollmentForm parent={user} onSuccess={handleEnrollmentSuccess} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'timetable' && selectedStudent && <Timetable student={selectedStudent} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'materials' && selectedStudent && <ViewMaterials student={selectedStudent} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'attendance' && selectedStudent && <AttendanceTracker student={selectedStudent} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'reportcard' && selectedStudent && <ReportCard student={selectedStudent} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'chat' && <ParentChatWithPasscode parent={user} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'payments' && <MonthlyPaymentSystem parent={user} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'profile' && selectedStudent && <StudentProfile student={selectedStudent} parent={user} onBack={() => setActiveTab('overview')} />}
        {activeTab === 'notifications' && <ParentNotifications parent={user} />}
        {activeTab === 'addsubjects' && <AddSubjects parent={user} onSuccess={loadStudents} />}
        {activeTab === 'settings' && <ParentAccountSettings parent={user} onUpdate={(updated) => console.log('Parent updated', updated)} />}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              disabled={item.requiresStudent && !selectedStudent}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              } ${item.requiresStudent && !selectedStudent ? 'opacity-50' : ''}`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
