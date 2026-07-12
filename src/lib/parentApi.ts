import { apiClient } from "./apiClient";

export interface BackendChild {
  id: string;
  fullName: string;
  className: string | null;
  school: string | null;
  relationship: string | null;
  gpa: number | null;
  attendanceRate: number | null;
  feesDue: number;
  feesPaid: number;
}

export interface BackendAttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface BackendPayment {
  id: string;
  amount: string;
  method: string;
  paidOn: string;
}

export interface BackendFeeRecord {
  id: string;
  amountDue: string;
  amountPaid: string;
  status: "paid" | "partial" | "overdue";
  dueDate: string;
  payments: BackendPayment[];
}

export interface BackendMedicalRecord {
  bloodGroup: string | null;
  allergies: string | null;
}

export interface BackendGrade {
  id: string;
  examName: string;
  date: string;
  score: number;
  maxScore: number;
}

export interface BackendAlert {
  id: string;
  childName: string;
  type: "student" | "health";
  reason: string | null;
  location: string | null;
  time: string;
  status: "active" | "responding" | "resolved";
}

export const parentApi = {
  listChildren: (token: string) => apiClient.get<BackendChild[]>("/parent/children", token),

  getGrades: (token: string, studentId: string) => apiClient.get<BackendGrade[]>(`/parent/children/${studentId}/grades`, token),

  listAlerts: (token: string) => apiClient.get<BackendAlert[]>("/parent/alerts", token),

  getTransport: (token: string, studentId: string) =>
    apiClient.get<{ routeName: string; driverName: string | null; status: "on_time" | "delayed" } | null>(
      `/parent/children/${studentId}/transport`,
      token
    ),

  getAttendance: (token: string, studentId: string) =>
    apiClient.get<BackendAttendanceRecord[]>(`/parent/children/${studentId}/attendance`, token),

  getFees: (token: string, studentId: string) =>
    apiClient.get<BackendFeeRecord[]>(`/parent/children/${studentId}/fees`, token),

  payFee: (token: string, studentId: string, feeId: string, payload: { amount: number; method: string }) =>
    apiClient.post(`/parent/children/${studentId}/fees/${feeId}/pay`, payload, token),

  getMedicalRecord: (token: string, studentId: string) =>
    apiClient.get<BackendMedicalRecord | null>(`/parent/children/${studentId}/medical`, token),

  sendSos: (token: string, studentId: string, reason: string) =>
    apiClient.post(`/parent/children/${studentId}/sos`, { reason }, token),
};
