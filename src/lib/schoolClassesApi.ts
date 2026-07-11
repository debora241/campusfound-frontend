import { apiClient } from "./apiClient";

export interface BackendClassRoom {
  id: string;
  name: string;
  room: string | null;
  teacherName: string | null;
  studentCount: number;
}

export const schoolClassesApi = {
  list: (token: string) => apiClient.get<BackendClassRoom[]>("/school/classes", token),
  create: (token: string, payload: { name: string; room?: string; teacherId?: string }) =>
    apiClient.post<BackendClassRoom>("/school/classes", payload, token),
};
