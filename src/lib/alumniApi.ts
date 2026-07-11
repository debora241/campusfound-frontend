import { apiClient } from "./apiClient";

export interface BackendAlumniProfile {
  id: string;
  name: string;
  program: string | null;
  institution: string | null;
  graduationYear: number | null;
}

export interface MyDiplomaResult {
  found: boolean;
  program?: string | null;
  classification?: string | null;
  issuedOn?: string;
  verified?: boolean;
  txHash?: string | null;
}

export interface BackendMentorship {
  id: string;
  topic: string;
  status: "requested" | "active" | "completed";
  requestedOn: string;
  student: { fullName: string };
}

export interface BackendAlumniEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attending: number;
  rsvped: boolean;
}

export const alumniApi = {
  network: {
    list: (token: string) => apiClient.get<BackendAlumniProfile[]>("/alumni/network", token),
  },
  diploma: {
    getMine: (token: string) => apiClient.get<MyDiplomaResult>("/alumni/diploma", token),
  },
  mentorship: {
    list: (token: string) => apiClient.get<BackendMentorship[]>("/alumni/mentorship", token),
    accept: (token: string, id: string) => apiClient.patch<BackendMentorship>(`/alumni/mentorship/${id}/accept`, {}, token),
  },
  events: {
    list: (token: string) => apiClient.get<BackendAlumniEvent[]>("/alumni/events", token),
    rsvp: (token: string, id: string) => apiClient.post(`/alumni/events/${id}/rsvp`, {}, token),
  },
};
