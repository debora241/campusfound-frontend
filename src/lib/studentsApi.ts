import { apiClient } from "./apiClient";

export interface BackendStudent {
  id: string;
  fullName: string;
  className: string | null;
  matricule: string | null;
  admissionNumber: string | null;
  status: "active" | "on_leave" | "suspended" | "graduated";
  gpa: number | null;
}

export interface CreateStudentPayload {
  fullName: string;
  className: string;
  matricule?: string;
  admissionNumber?: string;
  dateOfBirth?: string;
}

export const studentsApi = {
  list: (token: string, search?: string) =>
    apiClient.get<BackendStudent[]>(`/students${search ? `?search=${encodeURIComponent(search)}` : ""}`, token),

  create: (token: string, payload: CreateStudentPayload) => apiClient.post<BackendStudent>("/students", payload, token),

  update: (token: string, id: string, payload: Partial<CreateStudentPayload & { status: string }>) =>
    apiClient.patch<BackendStudent>(`/students/${id}`, payload, token),
};
