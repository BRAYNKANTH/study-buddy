import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Megaphone,
  UserPlus
} from 'lucide-react';
import PaymentApprovalEnhanced from './PaymentApprovalEnhanced';
import AdminStudentManagement from './AdminStudentManagement';
import AnnouncementsEnhanced from './AnnouncementsEnhanced';
import AdminTeacherManagement from './AdminTeacherManagement';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const parents = JSON.parse(localStorage.getItem('parents') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

  const pendingPayments = payments.filter((p: any) => p.status === 'Pending Approval');
  const approvedPayments = payments.filter((p: any) => p.status === 'Approved');
  const rejectedPayments = payments.filter((p: any) => p.status === 'Rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
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
                  ? 'border-gray-600 text-gray-700'
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
                  ? 'border-gray-600 text-gray-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Student Management
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-gray-600 text-gray-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="h-4 w-4 inline mr-2" />
              Payment Approvals
              {pendingPayments.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingPayments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'teachers'
                  ? 'border-gray-600 text-gray-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="h-4 w-4 inline mr-2" />
              Teacher Management
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'border-gray-600 text-gray-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Megaphone className="h-4 w-4 inline mr-2" />
              Announcements
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{students.length}</span>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">Total Parents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{parents.length}</span>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">Total Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{teachers.length}</span>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{pendingPayments.length}</span>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Payment Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <span>{pendingPayments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Approved</span>
                    </div>
                    <span>{approvedPayments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm">Rejected</span>
                    </div>
                    <span>{rejectedPayments.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Teachers by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teachers.map((teacher: any) => (
                      <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p>{teacher.name}</p>
                          <p className="text-sm text-gray-600">{teacher.subject}</p>
                        </div>
                        <span className="text-sm text-gray-500">{teacher.email}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'students' && <AdminStudentManagement />}
        {activeTab === 'payments' && <PaymentApprovalEnhanced />}
        {activeTab === 'teachers' && <AdminTeacherManagement />}
        {activeTab === 'announcements' && <AnnouncementsEnhanced user={user} userRole="admin" />}
      </div>
    </div>
  );
}
