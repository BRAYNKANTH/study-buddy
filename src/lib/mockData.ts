// Mock data for the system

export const subjects = ['English', 'Tamil', 'Mathematics', 'History', 'Science', 'Geography'];
export const grades = [6, 7, 8];

// One teacher per subject
export const teachers = [
  {
    id: 'T001',
    name: 'Sarah Williams',
    email: 'sarah.williams@tuition.com',
    password: 'teacher123',
    subject: 'English',
    phone: '+94 77 123 4567'
  },
  {
    id: 'T002',
    name: 'Kumar Raj',
    email: 'kumar.raj@tuition.com',
    password: 'teacher123',
    subject: 'Tamil',
    phone: '+94 71 234 5678'
  },
  {
    id: 'T003',
    name: 'David Chen',
    email: 'david.chen@tuition.com',
    password: 'teacher123',
    subject: 'Mathematics',
    phone: '+94 76 345 6789'
  },
  {
    id: 'T004',
    name: 'Nimal Perera',
    email: 'nimal.perera@tuition.com',
    password: 'teacher123',
    subject: 'History',
    phone: '+94 72 456 7890'
  },
  {
    id: 'T005',
    name: 'Dr. Samantha Silva',
    email: 'samantha.silva@tuition.com',
    password: 'teacher123',
    subject: 'Science',
    phone: '+94 75 567 8901'
  },
  {
    id: 'T006',
    name: 'Rajiv Fernando',
    email: 'rajiv.fernando@tuition.com',
    password: 'teacher123',
    subject: 'Geography',
    phone: '+94 78 678 9012'
  }
];

// Admin user
export const adminUser = {
  id: 'A001',
  name: 'Admin',
  email: 'admin@tuition.com',
  password: 'admin123',
  role: 'admin'
};

// Sri Lankan names pool
const firstNames = [
  'Ashan', 'Binara', 'Chamodi', 'Dilan', 'Eshani', 'Fathima', 'Gayathri', 'Hasith',
  'Imasha', 'Janith', 'Kavindu', 'Lithara', 'Manuli', 'Nethmi', 'Oshan', 'Pasan',
  'Ranudi', 'Sahan', 'Tharuka', 'Upeksha', 'Vindya', 'Wathsala', 'Yohan', 'Zahra',
  'Amaya', 'Bhagya', 'Charith', 'Dineth', 'Erandi', 'Fawaz', 'Gimhani', 'Harsha',
  'Ishara', 'Jayani', 'Kavinda', 'Lakshitha', 'Maheshi', 'Nipuni', 'Oshadhi', 'Pasindu'
];

const lastNames = [
  'Fernando', 'Silva', 'Perera', 'De Silva', 'Jayawardena', 'Gunawardena', 'Dias', 'Wijesinghe',
  'Rajapaksa', 'Bandara', 'Dissanayake', 'Jayasuriya', 'Wickramasinghe', 'Samaraweera', 'Mendis',
  'Gunasekara', 'Senanayake', 'Ranasinghe', 'Karunaratne', 'Amarasinghe', 'De Alwis', 'Rodrigo',
  'Herath', 'Gamage', 'Rathnayake', 'Weerasinghe', 'Abeysekara', 'Liyanage', 'Cooray', 'Seneviratne',
  'Pathirana', 'Kodikara', 'Jayakody', 'Wickremaratne', 'Gunathilaka', 'Fonseka', 'Wanigatunga',
  'Tennakoon', 'Ranatunga', 'Ekanayake'
];

// Generate 40 students per grade
function generateStudents() {
  const students = [];
  let studentId = 1;
  
  for (const grade of grades) {
    for (let i = 0; i < 40; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      
      // Randomly assign 3-5 subjects
      const numSubjects = 3 + Math.floor(Math.random() * 3);
      const studentSubjects = [...subjects]
        .sort(() => Math.random() - 0.5)
        .slice(0, numSubjects);
      
      students.push({
        id: `S${String(studentId).padStart(3, '0')}`,
        name,
        grade,
        subjects: studentSubjects
      });
      
      studentId++;
    }
  }
  
  return students;
}

// Mock students - 40 per grade (120 total)
export const mockStudents = generateStudents();

// Enhanced timetable with all 6 subjects
export const timetable = [
  // Grade 6 - Monday to Saturday
  { day: 'Monday', time: '8:00-9:00', grade: 6, subject: 'English', teacher: 'Sarah Williams' },
  { day: 'Monday', time: '9:15-10:15', grade: 6, subject: 'Tamil', teacher: 'Kumar Raj' },
  { day: 'Monday', time: '10:30-11:30', grade: 6, subject: 'Mathematics', teacher: 'David Chen' },
  
  { day: 'Tuesday', time: '8:00-9:00', grade: 6, subject: 'History', teacher: 'Nimal Perera' },
  { day: 'Tuesday', time: '9:15-10:15', grade: 6, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Tuesday', time: '10:30-11:30', grade: 6, subject: 'Geography', teacher: 'Rajiv Fernando' },
  
  { day: 'Wednesday', time: '8:00-9:00', grade: 6, subject: 'Tamil', teacher: 'Kumar Raj' },
  { day: 'Wednesday', time: '9:15-10:15', grade: 6, subject: 'Mathematics', teacher: 'David Chen' },
  { day: 'Wednesday', time: '10:30-11:30', grade: 6, subject: 'English', teacher: 'Sarah Williams' },
  
  { day: 'Thursday', time: '8:00-9:00', grade: 6, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Thursday', time: '9:15-10:15', grade: 6, subject: 'Geography', teacher: 'Rajiv Fernando' },
  { day: 'Thursday', time: '10:30-11:30', grade: 6, subject: 'History', teacher: 'Nimal Perera' },
  
  { day: 'Friday', time: '8:00-9:00', grade: 6, subject: 'Mathematics', teacher: 'David Chen' },
  { day: 'Friday', time: '9:15-10:15', grade: 6, subject: 'English', teacher: 'Sarah Williams' },
  { day: 'Friday', time: '10:30-11:30', grade: 6, subject: 'Tamil', teacher: 'Kumar Raj' },
  
  { day: 'Saturday', time: '8:00-9:00', grade: 6, subject: 'History', teacher: 'Nimal Perera' },
  { day: 'Saturday', time: '9:15-10:15', grade: 6, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Saturday', time: 'Saturday', grade: 6, subject: 'Geography', teacher: 'Rajiv Fernando' },
  
  // Grade 7 - Monday to Saturday
  { day: 'Monday', time: '13:00-14:00', grade: 7, subject: 'English', teacher: 'Sarah Williams' },
  { day: 'Monday', time: '14:15-15:15', grade: 7, subject: 'Tamil', teacher: 'Kumar Raj' },
  { day: 'Monday', time: '15:30-16:30', grade: 7, subject: 'Mathematics', teacher: 'David Chen' },
  
  { day: 'Tuesday', time: '13:00-14:00', grade: 7, subject: 'History', teacher: 'Nimal Perera' },
  { day: 'Tuesday', time: '14:15-15:15', grade: 7, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Tuesday', time: '15:30-16:30', grade: 7, subject: 'Geography', teacher: 'Rajiv Fernando' },
  
  { day: 'Wednesday', time: '13:00-14:00', grade: 7, subject: 'Tamil', teacher: 'Kumar Raj' },
  { day: 'Wednesday', time: '14:15-15:15', grade: 7, subject: 'Mathematics', teacher: 'David Chen' },
  { day: 'Wednesday', time: '15:30-16:30', grade: 7, subject: 'English', teacher: 'Sarah Williams' },
  
  { day: 'Thursday', time: '13:00-14:00', grade: 7, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Thursday', time: '14:15-15:15', grade: 7, subject: 'Geography', teacher: 'Rajiv Fernando' },
  { day: 'Thursday', time: '15:30-16:30', grade: 7, subject: 'History', teacher: 'Nimal Perera' },
  
  { day: 'Friday', time: '13:00-14:00', grade: 7, subject: 'Mathematics', teacher: 'David Chen' },
  { day: 'Friday', time: '14:15-15:15', grade: 7, subject: 'English', teacher: 'Sarah Williams' },
  { day: 'Friday', time: '15:30-16:30', grade: 7, subject: 'Tamil', teacher: 'Kumar Raj' },
  
  { day: 'Saturday', time: '13:00-14:00', grade: 7, subject: 'History', teacher: 'Nimal Perera' },
  { day: 'Saturday', time: '14:15-15:15', grade: 7, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Saturday', time: '15:30-16:30', grade: 7, subject: 'Geography', teacher: 'Rajiv Fernando' },
  
  // Grade 8 - Monday to Saturday
  { day: 'Monday', time: '16:45-17:45', grade: 8, subject: 'English', teacher: 'Sarah Williams' },
  { day: 'Monday', time: '18:00-19:00', grade: 8, subject: 'Tamil', teacher: 'Kumar Raj' },
  
  { day: 'Tuesday', time: '16:45-17:45', grade: 8, subject: 'Mathematics', teacher: 'David Chen' },
  { day: 'Tuesday', time: '18:00-19:00', grade: 8, subject: 'History', teacher: 'Nimal Perera' },
  
  { day: 'Wednesday', time: '16:45-17:45', grade: 8, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Wednesday', time: '18:00-19:00', grade: 8, subject: 'Geography', teacher: 'Rajiv Fernando' },
  
  { day: 'Thursday', time: '16:45-17:45', grade: 8, subject: 'Tamil', teacher: 'Kumar Raj' },
  { day: 'Thursday', time: '18:00-19:00', grade: 8, subject: 'Mathematics', teacher: 'David Chen' },
  
  { day: 'Friday', time: '16:45-17:45', grade: 8, subject: 'English', teacher: 'Sarah Williams' },
  { day: 'Friday', time: '18:00-19:00', grade: 8, subject: 'History', teacher: 'Nimal Perera' },
  
  { day: 'Saturday', time: '16:45-17:45', grade: 8, subject: 'Science', teacher: 'Dr. Samantha Silva' },
  { day: 'Saturday', time: '18:00-19:00', grade: 8, subject: 'Geography', teacher: 'Rajiv Fernando' }
];

// Sample study materials for all subjects
export const sampleMaterials = [
  // English Materials
  {
    id: 'M001',
    title: 'Grammar Basics - Grade 6',
    subject: 'English',
    grade: 6,
    uploadedBy: 'Sarah Williams',
    uploadDate: '2025-09-15',
    fileName: 'grammar_basics_g6.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M002',
    title: 'Creative Writing Tips',
    subject: 'English',
    grade: 7,
    uploadedBy: 'Sarah Williams',
    uploadDate: '2025-09-18',
    fileName: 'creative_writing_g7.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M003',
    title: 'Shakespeare Introduction',
    subject: 'English',
    grade: 8,
    uploadedBy: 'Sarah Williams',
    uploadDate: '2025-09-20',
    fileName: 'shakespeare_g8.pdf',
    fileType: 'application/pdf'
  },
  
  // Tamil Materials
  {
    id: 'M004',
    title: 'Tamil Alphabets & Vowels',
    subject: 'Tamil',
    grade: 6,
    uploadedBy: 'Kumar Raj',
    uploadDate: '2025-09-16',
    fileName: 'tamil_alphabets_g6.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M005',
    title: 'Tamil Poetry Analysis',
    subject: 'Tamil',
    grade: 7,
    uploadedBy: 'Kumar Raj',
    uploadDate: '2025-09-19',
    fileName: 'tamil_poetry_g7.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M006',
    title: 'Advanced Tamil Grammar',
    subject: 'Tamil',
    grade: 8,
    uploadedBy: 'Kumar Raj',
    uploadDate: '2025-09-22',
    fileName: 'tamil_grammar_g8.pdf',
    fileType: 'application/pdf'
  },
  
  // Mathematics Materials
  {
    id: 'M007',
    title: 'Basic Algebra Concepts',
    subject: 'Mathematics',
    grade: 6,
    uploadedBy: 'David Chen',
    uploadDate: '2025-09-17',
    fileName: 'algebra_basics_g6.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M008',
    title: 'Geometry and Shapes',
    subject: 'Mathematics',
    grade: 7,
    uploadedBy: 'David Chen',
    uploadDate: '2025-09-21',
    fileName: 'geometry_g7.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M009',
    title: 'Trigonometry Fundamentals',
    subject: 'Mathematics',
    grade: 8,
    uploadedBy: 'David Chen',
    uploadDate: '2025-09-23',
    fileName: 'trigonometry_g8.pdf',
    fileType: 'application/pdf'
  },
  
  // History Materials
  {
    id: 'M010',
    title: 'Ancient Civilizations',
    subject: 'History',
    grade: 6,
    uploadedBy: 'Nimal Perera',
    uploadDate: '2025-09-14',
    fileName: 'ancient_civilizations_g6.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M011',
    title: 'Sri Lankan History - Colonial Era',
    subject: 'History',
    grade: 7,
    uploadedBy: 'Nimal Perera',
    uploadDate: '2025-09-25',
    fileName: 'colonial_era_g7.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M012',
    title: 'World War II Overview',
    subject: 'History',
    grade: 8,
    uploadedBy: 'Nimal Perera',
    uploadDate: '2025-09-28',
    fileName: 'wwii_overview_g8.pdf',
    fileType: 'application/pdf'
  },
  
  // Science Materials
  {
    id: 'M013',
    title: 'Introduction to Biology',
    subject: 'Science',
    grade: 6,
    uploadedBy: 'Dr. Samantha Silva',
    uploadDate: '2025-09-12',
    fileName: 'biology_intro_g6.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M014',
    title: 'Chemistry Basics - Elements',
    subject: 'Science',
    grade: 7,
    uploadedBy: 'Dr. Samantha Silva',
    uploadDate: '2025-09-26',
    fileName: 'chemistry_elements_g7.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M015',
    title: 'Physics - Motion and Force',
    subject: 'Science',
    grade: 8,
    uploadedBy: 'Dr. Samantha Silva',
    uploadDate: '2025-09-29',
    fileName: 'physics_motion_g8.pdf',
    fileType: 'application/pdf'
  },
  
  // Geography Materials
  {
    id: 'M016',
    title: 'Maps and Continents',
    subject: 'Geography',
    grade: 6,
    uploadedBy: 'Rajiv Fernando',
    uploadDate: '2025-09-13',
    fileName: 'maps_continents_g6.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M017',
    title: 'Climate Zones',
    subject: 'Geography',
    grade: 7,
    uploadedBy: 'Rajiv Fernando',
    uploadDate: '2025-09-27',
    fileName: 'climate_zones_g7.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'M018',
    title: 'Economic Geography',
    subject: 'Geography',
    grade: 8,
    uploadedBy: 'Rajiv Fernando',
    uploadDate: '2025-09-30',
    fileName: 'economic_geography_g8.pdf',
    fileType: 'application/pdf'
  }
];

// Generate sample attendance records for past 30 days
function generateSampleAttendance() {
  const attendance: any[] = [];
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const today = new Date();
  
  // Generate attendance for past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Skip Sundays
    if (date.getDay() === 0) continue;
    
    students.forEach((student: any) => {
      student.subjects.forEach((subject: string) => {
        // 90% chance of being present
        const status = Math.random() > 0.10 ? 'Present' : 'Absent';
        attendance.push({
          id: `ATT${Date.now()}_${student.id}_${subject}_${i}`,
          studentId: student.id,
          studentName: student.name,
          subject: subject,
          date: dateString,
          status: status,
          scannedAt: new Date(date.setHours(8 + Math.floor(Math.random() * 4))).toISOString()
        });
      });
    });
  }
  
  return attendance;
}

// Generate First Term marks for all students
function generateFirstTermMarks() {
  const marks: any[] = [];
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  
  students.forEach((student: any) => {
    student.subjects.forEach((subject: string) => {
      // Generate realistic marks between 45-95
      const mark = 45 + Math.floor(Math.random() * 51);
      let grade = 'F';
      if (mark >= 90) grade = 'A+';
      else if (mark >= 85) grade = 'A';
      else if (mark >= 75) grade = 'B';
      else if (mark >= 65) grade = 'C';
      else if (mark >= 50) grade = 'S';
      
      marks.push({
        id: `M_FIRST_${student.id}_${subject}`,
        studentId: student.id,
        studentName: student.name,
        subject: subject,
        term: 'First Term',
        marks: mark,
        grade: grade,
        uploadedBy: teachers.find((t: any) => t.subject === subject)?.name || 'Unknown',
        uploadDate: '2025-09-30'
      });
    });
  });
  
  return marks;
}

// Generate sample payments for mock students
function generateSamplePayments() {
  const payments: any[] = [];
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const parents = JSON.parse(localStorage.getItem('parents') || '[]');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
  
  // For the first 20 students, generate some payment history
  students.slice(0, 20).forEach((student: any, index: number) => {
    // Generate 3-6 months of payment history
    const numPayments = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numPayments; i++) {
      const month = months[9 - i]; // October backwards
      const amount = 5000 + (student.subjects.length * 1500); // Rs. 5000 base + Rs. 1500 per subject
      const statuses = ['Approved', 'Approved', 'Approved', 'Pending Approval']; // Mostly approved
      const status = i === 0 ? statuses[3] : statuses[Math.floor(Math.random() * 3)];
      
      const paymentDate = new Date(2025, 9 - i, 5 + Math.floor(Math.random() * 10)); // Random date in month
      
      payments.push({
        id: `PAY${Date.now()}_${student.id}_${i}`,
        studentId: student.id,
        studentName: student.name,
        parentId: student.parentId || 'DEMO_PARENT',
        parentName: 'Demo Parent',
        month: month,
        year: 2025,
        amount: `Rs. ${amount.toLocaleString()}`,
        reference: `REF${Math.floor(Math.random() * 1000000)}`,
        receipt: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        receiptFileName: `payment_receipt_${month.toLowerCase()}.pdf`,
        status: status,
        submittedDate: paymentDate.toISOString(),
        approvedDate: status === 'Approved' ? new Date(paymentDate.getTime() + 86400000 * 2).toISOString() : undefined,
        approvedBy: status === 'Approved' ? 'Admin' : undefined
      });
    }
  });
  
  return payments;
}

// Initialize localStorage with mock data
export function initializeMockData() {
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }
  
  if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify(adminUser));
  }
  
  if (!localStorage.getItem('timetable')) {
    localStorage.setItem('timetable', JSON.stringify(timetable));
  }
  
  if (!localStorage.getItem('studyMaterials')) {
    localStorage.setItem('studyMaterials', JSON.stringify(sampleMaterials));
  }
  
  if (!localStorage.getItem('parents')) {
    localStorage.setItem('parents', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('students')) {
    // Initialize with mock students for demo purposes
    localStorage.setItem('students', JSON.stringify(mockStudents));
  }
  
  if (!localStorage.getItem('payments')) {
    // Generate some sample payment history
    const samplePayments = generateSamplePayments();
    localStorage.setItem('payments', JSON.stringify(samplePayments));
  }
  
  if (!localStorage.getItem('chats')) {
    localStorage.setItem('chats', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('attendance')) {
    // Generate attendance for mock students
    const sampleAttendance = generateSampleAttendance();
    localStorage.setItem('attendance', JSON.stringify(sampleAttendance));
  }
  
  if (!localStorage.getItem('marks')) {
    // Generate First Term marks for all students
    const firstTermMarks = generateFirstTermMarks();
    localStorage.setItem('marks', JSON.stringify(firstTermMarks));
  }
  
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('announcements')) {
    localStorage.setItem('announcements', JSON.stringify([]));
  }
}

// Load sample data for enrolled students
export function loadSampleDataForStudents() {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  
  if (students.length > 0) {
    // Refresh attendance and marks if needed
    const existingAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const existingMarks = JSON.parse(localStorage.getItem('marks') || '[]');
    
    if (existingAttendance.length === 0) {
      const sampleAttendance = generateSampleAttendance();
      localStorage.setItem('attendance', JSON.stringify(sampleAttendance));
    }
    
    if (existingMarks.length === 0) {
      const firstTermMarks = generateFirstTermMarks();
      localStorage.setItem('marks', JSON.stringify(firstTermMarks));
    }
  }
}
