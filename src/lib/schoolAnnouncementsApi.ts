import { apiClient } from "./apiClient";

export interface BackendAnnouncement {
  id: string;
  title: string;
  audience: string;
  publishedOn: string;
  pinned: boolean;
}

export const schoolAnnouncementsApi = {
  list: (token: string) => apiClient.get<BackendAnnouncement[]>("/school/announcements", token),
  create: (token: string, payload: { title: string; audience: string; pinned?: boolean }) =>
    apiClient.post<BackendAnnouncement>("/school/announcements", payload, token),
};
