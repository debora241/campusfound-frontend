import { apiClient } from "./apiClient";

export interface BackendTeacher {
  id: string;
  fullName: string;
  staffId: string | null;
  subject: string | null;
  department: string | null;
}

export interface CreateTeacherPayload {
  fullName: string;
  subject: string;
  staffId?: string;
  department?: string;
}

export const teachersApi = {
  list: (token: string, search?: string) =>
    apiClient.get<BackendTeacher[]>(`/teachers${search ? `?search=${encodeURIComponent(search)}` : ""}`, token),

  create: (token: string, payload: CreateTeacherPayload) => apiClient.post<BackendTeacher>("/teachers", payload, token),
};
