import { apiClient } from "./apiClient";

export interface BackendBook {
  id: string;
  title: string;
  author: string;
  category: string | null;
  totalCopies: number;
  availableCopies: number;
}

export const schoolLibraryApi = {
  list: (token: string) => apiClient.get<BackendBook[]>("/school/library", token),
  create: (token: string, payload: { title: string; author: string; category?: string; totalCopies?: number }) =>
    apiClient.post<BackendBook>("/school/library", payload, token),
};
