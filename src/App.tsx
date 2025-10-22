import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ParentRegistration from './components/ParentRegistration';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import { Toaster } from './components/ui/sonner';
import { initializeMockData, loadSampleDataForStudents } from './lib/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    // Load sample data for enrolled students
    loadSampleDataForStudents();
    
    // Check if user is already logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      
      // Route to appropriate dashboard
      if (parsedUser.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (parsedUser.role === 'teacher') {
        setCurrentPage('teacher-dashboard');
      } else if (parsedUser.role === 'parent') {
        setCurrentPage('parent-dashboard');
      }
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Route based on role
    if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (user.role === 'teacher') {
      setCurrentPage('teacher-dashboard');
    } else if (user.role === 'parent') {
      setCurrentPage('parent-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentPage('register')} 
          onLogin={() => setCurrentPage('login')} 
        />
      )}

      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onNavigateToRegister={() => setCurrentPage('register')}
          onBack={() => setCurrentPage('landing')} 
        />
      )}
      
      {currentPage === 'register' && (
        <ParentRegistration 
          onSuccess={() => setCurrentPage('login')} 
          onBack={() => setCurrentPage('landing')} 
        />
      )}
      
      {currentPage === 'admin-dashboard' && currentUser && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
      
      {currentPage === 'teacher-dashboard' && currentUser && (
        <TeacherDashboard user={currentUser} onLogout={handleLogout} />
      )}
      
      {currentPage === 'parent-dashboard' && currentUser && (
        <ParentDashboard user={currentUser} onLogout={handleLogout} />
      )}
      
      <Toaster />
    </div>
  );
}

export default App;
