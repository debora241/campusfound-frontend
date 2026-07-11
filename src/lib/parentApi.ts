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

export const parentApi = {
  listChildren: (token: string) => apiClient.get<BackendChild[]>("/parent/children", token),

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
