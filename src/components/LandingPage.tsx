import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award,
  Clock,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  BarChart3,
  FileText,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-indigo-900">Study-Buddy</h1>
                <p className="text-xs text-gray-600">Tuition Management System</p>
              </div>
            </div>
            <Button onClick={onLogin} variant="outline" className="hidden sm:flex">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-block">
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm">
                  ✨ Modern Education Management
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900">
                Transform Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  Tuition Center
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Comprehensive management system for grades 6-8. Handle enrollment, attendance, 
                payments, and communication all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button 
                  onClick={onGetStarted} 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button onClick={onLogin} size="lg" variant="outline">
                  Sign In
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl text-indigo-600">120+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl text-indigo-600">6</div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl text-indigo-600">3</div>
                  <div className="text-sm text-gray-600">Grades</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-blue-500/20 rounded-3xl transform rotate-3"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1639548538099-6f7f9aec3b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2MTA2MDg1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Students learning"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              Everything You Need to Manage Your Tuition
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for parents, teachers, and administrators
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature Cards */}
            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <UserPlus className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Easy Enrollment</h3>
                <p className="text-gray-600">
                  Quick student registration with QR code generation for attendance tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <CheckCircle className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">QR Attendance</h3>
                <p className="text-gray-600">
                  Scan student QR codes for instant attendance marking and tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <FileText className="h-6 w-6 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Payment Tracking</h3>
                <p className="text-gray-600">
                  Upload receipts, track payment history, and get instant approval notifications
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Marks Management</h3>
                <p className="text-gray-600">
                  Track student performance with automatic grading and detailed report cards
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                  <MessageSquare className="h-6 w-6 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Secure Chat</h3>
                <p className="text-gray-600">
                  Direct messaging between parents and teachers with passcode protection
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="bg-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-600 transition-colors">
                  <Calendar className="h-6 w-6 text-pink-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Smart Timetable</h3>
                <p className="text-gray-600">
                  View and manage class schedules for all grades and subjects in one place
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              Six Core Subjects
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive curriculum for grades 6, 7, and 8
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'English', icon: '📚', color: 'from-blue-500 to-blue-600' },
              { name: 'Tamil', icon: '📝', color: 'from-orange-500 to-orange-600' },
              { name: 'Mathematics', icon: '🔢', color: 'from-green-500 to-green-600' },
              { name: 'History', icon: '🏛️', color: 'from-purple-500 to-purple-600' },
              { name: 'Science', icon: '🔬', color: 'from-pink-500 to-pink-600' },
              { name: 'Geography', icon: '🌍', color: 'from-indigo-500 to-indigo-600' },
            ].map((subject) => (
              <div key={subject.name} className="text-center">
                <div className={`bg-gradient-to-br ${subject.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow mb-3`}>
                  <div className="text-4xl mb-2">{subject.icon}</div>
                  <div className="text-white">{subject.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-gray-600">
              Tailored dashboards for each role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Parents */}
            <Card className="border-2 border-indigo-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-4">Parents</h3>
                <ul className="space-y-3 text-left text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Enroll students and manage profiles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Track attendance and marks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Chat with teachers securely</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Upload payment receipts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Teachers */}
            <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-4">Teachers</h3>
                <ul className="space-y-3 text-left text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Upload study materials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Mark attendance with QR scan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Upload and manage marks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Communicate with parents</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin */}
            <Card className="border-2 border-green-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-4">Admin</h3>
                <ul className="space-y-3 text-left text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manage all users and students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Approve payment receipts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manage timetables</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Post announcements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl mb-6">
            Ready to Transform Your Tuition Center?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join us today and experience modern education management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg"
            >
              Register as Parent
            </Button>
            <Button 
              onClick={onLogin}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white">Study-Buddy</div>
                  <div className="text-xs text-gray-400">Tuition Management System</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering education through technology
              </p>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={onLogin} className="hover:text-white">Sign In</button></li>
                <li><button onClick={onGetStarted} className="hover:text-white">Register</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@Study-Buddy.lk</li>
                <li>Phone: +94 11 234 5678</li>
                <li>Location: Colombo, Sri Lanka</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Study-Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function UserPlus(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}
