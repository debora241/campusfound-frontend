import { apiClient } from "./apiClient";

export interface BackendFee {
  id: string;
  amountDue: string;
  amountPaid: string;
  status: "paid" | "partial" | "overdue";
  dueDate: string;
  student: { fullName: string; className: string | null };
  payments: { id: string; amount: string; method: string; paidOn: string }[];
}

export const schoolFeesApi = {
  list: (token: string) => apiClient.get<BackendFee[]>("/school/fees", token),
  create: (token: string, payload: { studentId: string; amountDue: number; dueDate: string }) =>
    apiClient.post<BackendFee>("/school/fees", payload, token),
  pay: (token: string, feeId: string, payload: { amount: number; method: string }) =>
    apiClient.post(`/school/fees/${feeId}/pay`, payload, token),
};
