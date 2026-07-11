import { apiClient } from "./apiClient";

export interface BackendExam {
  id: string;
  name: string;
  className: string | null;
  date: string;
  status: "scheduled" | "in_progress" | "graded";
}

export interface BackendGrade {
  id: string;
  studentId: string;
  score: number;
  maxScore: number;
  student: { fullName: string };
}

export const schoolExamsApi = {
  list: (token: string) => apiClient.get<BackendExam[]>("/school/exams", token),
  create: (token: string, payload: { name: string; className: string; date: string }) =>
    apiClient.post<BackendExam>("/school/exams", payload, token),
  updateStatus: (token: string, examId: string, status: string) =>
    apiClient.patch<BackendExam>(`/school/exams/${examId}`, { status }, token),
  listGrades: (token: string, examId: string) => apiClient.get<BackendGrade[]>(`/school/exams/${examId}/grades`, token),
  setGrade: (token: string, examId: string, payload: { studentId: string; score: number; maxScore?: number }) =>
    apiClient.post<BackendGrade>(`/school/exams/${examId}/grades`, payload, token),
};
