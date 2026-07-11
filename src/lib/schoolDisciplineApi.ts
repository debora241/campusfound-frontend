import { apiClient } from "./apiClient";

export interface BackendDisciplineCase {
  id: string;
  studentId: string;
  incident: string;
  severity: "minor" | "moderate" | "severe";
  status: "open" | "resolved";
  reportedOn: string;
  student: { fullName: string };
}

export const schoolDisciplineApi = {
  list: (token: string) => apiClient.get<BackendDisciplineCase[]>("/school/discipline", token),
  create: (token: string, payload: { studentId: string; incident: string; severity: string }) =>
    apiClient.post<BackendDisciplineCase>("/school/discipline", payload, token),
  resolve: (token: string, id: string) => apiClient.patch<BackendDisciplineCase>(`/school/discipline/${id}/resolve`, {}, token),
};
