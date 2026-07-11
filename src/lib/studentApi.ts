import { apiClient } from "./apiClient";

export interface StudentDashboard {
  fullName: string;
  className: string | null;
  program: string | null;
  institutionName: string | null;
  gpa: number | null;
  attendanceRate: number | null;
  upcoming: { id: string; title: string; due: string }[];
  recentGrades: { id: string; title: string; score: number; maxScore: number }[];
  credentialCount: number;
}

export interface StudentCourse {
  id: string;
  name: string;
  instructor: string | null;
  meta: string | null;
}

export interface StudentAssignment {
  id: string;
  title: string;
  dueDate: string;
  status: "scheduled" | "in_progress" | "graded";
}

export interface StudentGrade {
  id: string;
  examName: string;
  date: string;
  score: number;
  maxScore: number;
}

export interface StudentCalendarEvent {
  id: string;
  date: string;
  type: "exam" | "attendance" | "announcement";
  title: string;
}

export interface StudentCredential {
  id: string;
  type: "report_card" | "certificate" | "diploma";
  classification: string | null;
  issuedOn: string;
  verified: boolean;
  txHash: string | null;
}

export interface StudentPayment {
  id: string;
  amount: string;
  method: string;
  paidOn: string;
}

export interface StudentFeeRecord {
  id: string;
  amountDue: string;
  amountPaid: string;
  status: "paid" | "partial" | "overdue";
  dueDate: string;
  payments: StudentPayment[];
}

export const studentApi = {
  getDashboard: (token: string) => apiClient.get<StudentDashboard>("/student/me/dashboard", token),
  getCourses: (token: string) => apiClient.get<StudentCourse[]>("/student/me/courses", token),
  getAssignments: (token: string) => apiClient.get<StudentAssignment[]>("/student/me/assignments", token),
  getGrades: (token: string) => apiClient.get<StudentGrade[]>("/student/me/grades", token),
  getCalendar: (token: string) => apiClient.get<StudentCalendarEvent[]>("/student/me/calendar", token),
  getCredentials: (token: string) => apiClient.get<StudentCredential[]>("/student/me/credentials", token),
  getWallet: (token: string) => apiClient.get<StudentFeeRecord[]>("/student/me/wallet", token),
};
