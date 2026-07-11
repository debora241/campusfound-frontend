import { apiClient } from "./apiClient";

export interface UniBackendStudent {
  id: string;
  fullName: string;
  program: string | null;
  year: number | null;
  registrationNumber: string | null;
  status: "active" | "on_leave" | "suspended" | "graduated";
  gpa: number | null;
}

export interface UniBackendFaculty {
  id: string;
  fullName: string;
  department: string | null;
  staffId: string | null;
  subject: string | null;
}

export interface UniBackendProgram {
  id: string;
  name: string;
  faculty: string;
  durationYears: number;
  enrolled: number;
}

export interface UniBackendExam {
  id: string;
  name: string;
  className: string | null;
  date: string;
  status: "scheduled" | "in_progress" | "graded";
}

export interface UniBackendDiploma {
  id: string;
  classification: string | null;
  issuedOn: string;
  verified: boolean;
  txHash: string | null;
  student: { fullName: string; program: string | null };
}

export interface UniBackendFee {
  id: string;
  amountDue: string;
  amountPaid: string;
  status: "paid" | "partial" | "overdue";
  dueDate: string;
  student: { fullName: string; program: string | null };
}

export const universityApi = {
  students: {
    list: (token: string, search?: string) =>
      apiClient.get<UniBackendStudent[]>(`/university/students${search ? `?search=${encodeURIComponent(search)}` : ""}`, token),
    create: (token: string, payload: { fullName: string; program: string; year?: number; registrationNumber?: string }) =>
      apiClient.post<UniBackendStudent>("/university/students", payload, token),
  },
  faculty: {
    list: (token: string) => apiClient.get<UniBackendFaculty[]>("/university/faculty", token),
    create: (token: string, payload: { fullName: string; department: string; staffId?: string; subject?: string }) =>
      apiClient.post<UniBackendFaculty>("/university/faculty", payload, token),
  },
  programs: {
    list: (token: string) => apiClient.get<UniBackendProgram[]>("/university/programs", token),
    create: (token: string, payload: { name: string; faculty: string; durationYears: number }) =>
      apiClient.post<UniBackendProgram>("/university/programs", payload, token),
  },
  exams: {
    list: (token: string) => apiClient.get<UniBackendExam[]>("/university/exams", token),
    create: (token: string, payload: { name: string; className: string; date: string }) =>
      apiClient.post<UniBackendExam>("/university/exams", payload, token),
    updateStatus: (token: string, id: string, status: string) =>
      apiClient.patch<UniBackendExam>(`/university/exams/${id}`, { status }, token),
  },
  diplomas: {
    list: (token: string) => apiClient.get<UniBackendDiploma[]>("/university/diplomas", token),
    issue: (token: string, payload: { studentId: string; classification: string }) =>
      apiClient.post<UniBackendDiploma>("/university/diplomas", payload, token),
  },
  finance: {
    list: (token: string) => apiClient.get<UniBackendFee[]>("/university/finance", token),
    create: (token: string, payload: { studentId: string; amountDue: number; dueDate: string }) =>
      apiClient.post<UniBackendFee>("/university/finance", payload, token),
    pay: (token: string, feeId: string, payload: { amount: number; method: string }) =>
      apiClient.post(`/university/finance/${feeId}/pay`, payload, token),
  },
};
