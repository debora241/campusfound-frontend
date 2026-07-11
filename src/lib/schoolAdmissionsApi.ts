import { apiClient } from "./apiClient";

export interface BackendAdmission {
  id: string;
  applicantName: string;
  gradeApplied: string;
  stage: "submitted" | "review" | "interview" | "accepted" | "rejected";
  submittedOn: string;
}

export const schoolAdmissionsApi = {
  list: (token: string) => apiClient.get<BackendAdmission[]>("/school/admissions", token),
  create: (token: string, payload: { applicantName: string; gradeApplied: string }) =>
    apiClient.post<BackendAdmission>("/school/admissions", payload, token),
  updateStage: (token: string, id: string, stage: string) =>
    apiClient.patch<BackendAdmission>(`/school/admissions/${id}`, { stage }, token),
};
