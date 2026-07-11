import { apiClient } from "./apiClient";

export interface InstitutionResult {
  id: string;
  name: string;
  code: string;
  region: string;
  type: "School" | "University";
}

export const institutionsApi = {
  search: (query: string) => apiClient.get<InstitutionResult[]>(`/institutions/search?query=${encodeURIComponent(query)}`),
};
