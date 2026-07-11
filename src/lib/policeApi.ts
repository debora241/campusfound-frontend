import { apiClient } from "./apiClient";

export interface BackendSosAlert {
  id: string;
  location: string;
  triggeredAt: string;
  status: "active" | "responding" | "resolved";
  student: { fullName: string; school: { name: string } | null };
}

export interface BackendMissingCase {
  id: string;
  lastSeen: string;
  lastLocation: string;
  status: "searching" | "found";
  student: { fullName: string; school: { name: string } | null };
}

export interface BackendGeoFence {
  id: string;
  name: string;
  radiusMeters: number;
  studentsInZone: number;
  status: "normal" | "breach";
  school: { name: string } | null;
}

export interface BackendIncident {
  id: string;
  title: string;
  location: string;
  severity: "low" | "medium" | "high";
  status: "open" | "investigating" | "closed";
  reportedAt: string;
}

export interface BackendResponseRecord {
  id: string;
  respondingUnit: string;
  responseTimeMinutes: number;
  outcome: string;
  incident: { title: string };
}

export interface StudentVerificationResult {
  found: boolean;
  id?: string;
  name?: string;
  identifier?: string;
  institution?: string | null;
  guardianPhone?: string | null;
}

export const policeApi = {
  sos: {
    list: (token: string) => apiClient.get<BackendSosAlert[]>("/police/sos", token),
    updateStatus: (token: string, id: string, status: string) => apiClient.patch<BackendSosAlert>(`/police/sos/${id}`, { status }, token),
  },
  missing: {
    list: (token: string) => apiClient.get<BackendMissingCase[]>("/police/missing-students", token),
    markFound: (token: string, id: string) => apiClient.patch(`/police/missing-students/${id}/found`, {}, token),
  },
  geofences: {
    list: (token: string) => apiClient.get<BackendGeoFence[]>("/police/geofences", token),
  },
  incidents: {
    list: (token: string) => apiClient.get<BackendIncident[]>("/police/incidents", token),
    create: (token: string, payload: { title: string; location: string; severity: string }) =>
      apiClient.post<BackendIncident>("/police/incidents", payload, token),
    respond: (token: string, id: string, payload: { respondingUnit: string; responseTimeMinutes: number; outcome: string }) =>
      apiClient.post(`/police/incidents/${id}/respond`, payload, token),
  },
  responses: {
    list: (token: string) => apiClient.get<BackendResponseRecord[]>("/police/responses", token),
  },
  verify: (token: string, query: string) => apiClient.get<StudentVerificationResult>(`/police/verify?query=${encodeURIComponent(query)}`, token),
};
