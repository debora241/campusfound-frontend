export interface TeacherClass {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  nextLesson: string;
}

export const TEACHER_CLASSES: TeacherClass[] = [
  { id: "CLS-1", name: "Form 5A", subject: "Mathematics", studentCount: 32, nextLesson: "Today, 10:00 AM" },
  { id: "CLS-2", name: "Form 4A", subject: "Mathematics", studentCount: 29, nextLesson: "Today, 1:00 PM" },
  { id: "CLS-3", name: "Form 3B", subject: "Mathematics", studentCount: 34, nextLesson: "Tomorrow, 8:00 AM" },
  { id: "CLS-4", name: "Form 2B", subject: "Additional Maths", studentCount: 21, nextLesson: "Tomorrow, 11:00 AM" },
];

export interface ClassStudent {
  id: string;
  name: string;
  classId: string;
}

export const CLASS_STUDENTS: ClassStudent[] = [
  { id: "STU-1042", name: "Aminata Diallo", classId: "CLS-1" },
  { id: "STU-1048", name: "Fatima Bello", classId: "CLS-1" },
  { id: "STU-1060", name: "Ndeye Sow", classId: "CLS-1" },
  { id: "STU-1061", name: "Blaise Kamdem", classId: "CLS-1" },
  { id: "STU-1051", name: "David Osei", classId: "CLS-2" },
  { id: "STU-1046", name: "Chidinma Okafor", classId: "CLS-2" },
  { id: "STU-1043", name: "Junior Mbeki", classId: "CLS-3" },
  { id: "STU-1049", name: "Emeka Nwosu", classId: "CLS-3" },
];

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: "open" | "closed" | "grading";
}

export const ASSIGNMENTS: Assignment[] = [
  { id: "ASG-1", title: "Quadratic Equations — Problem Set", classId: "CLS-1", dueDate: "Jul 7, 2026", submissions: 28, totalStudents: 32, status: "open" },
  { id: "ASG-2", title: "Trigonometry Worksheet", classId: "CLS-2", dueDate: "Jul 5, 2026", submissions: 29, totalStudents: 29, status: "grading" },
  { id: "ASG-3", title: "Term 2 Revision Pack", classId: "CLS-3", dueDate: "Jun 28, 2026", submissions: 34, totalStudents: 34, status: "closed" },
];

export interface GradeEntry {
  studentId: string;
  studentName: string;
  assignment1: number | null;
  assignment2: number | null;
  midterm: number | null;
}

export const GRADEBOOK: GradeEntry[] = [
  { studentId: "STU-1042", studentName: "Aminata Diallo", assignment1: 18, assignment2: 17, midterm: 36 },
  { studentId: "STU-1048", studentName: "Fatima Bello", assignment1: 14, assignment2: 15, midterm: 29 },
  { studentId: "STU-1060", studentName: "Ndeye Sow", assignment1: 19, assignment2: 18, midterm: 38 },
  { studentId: "STU-1061", studentName: "Blaise Kamdem", assignment1: 12, assignment2: null, midterm: 24 },
];

export interface TimetableEntry {
  day: string;
  time: string;
  className: string;
  room: string;
}

export const TIMETABLE: TimetableEntry[] = [
  { day: "Mon", time: "8:00 – 9:00", className: "Form 3B", room: "Rm 3" },
  { day: "Mon", time: "10:00 – 11:00", className: "Form 5A", room: "Rm 12" },
  { day: "Tue", time: "8:00 – 9:00", className: "Form 4A", room: "Rm 14" },
  { day: "Tue", time: "11:00 – 12:00", className: "Form 2B", room: "Rm 5" },
  { day: "Wed", time: "10:00 – 11:00", className: "Form 5A", room: "Rm 12" },
  { day: "Thu", time: "8:00 – 9:00", className: "Form 3B", room: "Rm 3" },
  { day: "Fri", time: "1:00 – 2:00", className: "Form 4A", room: "Rm 14" },
];

export interface TeacherMessage {
  id: string;
  from: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const TEACHER_MESSAGES: TeacherMessage[] = [
  { id: "TM-1", from: "Fatou Diallo", role: "Parent — Aminata Diallo", preview: "Thank you for the feedback on the physics project.", time: "9:40 AM", unread: true },
  { id: "TM-2", from: "School Administration", role: "Lycée Bilingue de Douala", preview: "Please submit Term 4 grade sheets by July 20.", time: "Yesterday", unread: true },
  { id: "TM-3", from: "Paul Mbeki", role: "Parent — Junior Mbeki", preview: "Can we schedule a call about Junior's attendance?", time: "Jul 2", unread: false },
];
