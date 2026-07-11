import { apiClient } from "./apiClient";

export interface BackendMedicalRecord {
  id: string;
  bloodGroup: string | null;
  allergies: string | null;
  lastUpdated: string;
  student: { fullName: string; school: { name: string } | null };
}

export interface BackendVaccinationCampaign {
  id: string;
  name: string;
  coverage: number;
  dueDate: string;
  school: { name: string };
}

export interface BackendTelemedicineRequest {
  id: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "in_call" | "completed";
  student: { fullName: string };
}

export interface BackendHealthSos {
  id: string;
  reason: string | null;
  triggeredAt: string;
  status: "active" | "responding" | "resolved";
  student: { fullName: string; school: { name: string } | null };
}

export interface BackendHealthReport {
  id: string;
  title: string;
  school: string;
  generatedOn: string;
  metric: string;
}

export const healthApi = {
  records: {
    list: (token: string) => apiClient.get<BackendMedicalRecord[]>("/health/records", token),
  },
  reports: {
    list: (token: string) => apiClient.get<BackendHealthReport[]>("/health/reports", token),
  },
  vaccinations: {
    list: (token: string) => apiClient.get<BackendVaccinationCampaign[]>("/health/vaccinations", token),
    create: (token: string, payload: { schoolId: string; name: string; dueDate: string }) =>
      apiClient.post<BackendVaccinationCampaign>("/health/vaccinations", payload, token),
    updateCoverage: (token: string, id: string, coverage: number) =>
      apiClient.patch<BackendVaccinationCampaign>(`/health/vaccinations/${id}`, { coverage }, token),
  },
  telemedicine: {
    list: (token: string) => apiClient.get<BackendTelemedicineRequest[]>("/health/telemedicine", token),
    join: (token: string, id: string) => apiClient.patch<BackendTelemedicineRequest>(`/health/telemedicine/${id}/join`, {}, token),
    complete: (token: string, id: string) => apiClient.patch<BackendTelemedicineRequest>(`/health/telemedicine/${id}/complete`, {}, token),
  },
  sos: {
    list: (token: string) => apiClient.get<BackendHealthSos[]>("/health/sos", token),
    updateStatus: (token: string, id: string, status: string) => apiClient.patch<BackendHealthSos>(`/health/sos/${id}`, { status }, token),
  },
};
