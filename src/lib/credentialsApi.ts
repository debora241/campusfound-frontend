import { apiClient } from "./apiClient";

export interface BackendCredential {
  id: string;
  type: "report_card" | "certificate" | "diploma";
  classification: string | null;
  issuedOn: string;
  verified: boolean;
  txHash: string | null;
  student: { fullName: string };
}

export interface VerificationResult {
  found: boolean;
  student?: string;
  type?: string;
  classification?: string | null;
  issuedOn?: string;
  txHash?: string;
}

export const schoolCredentialsApi = {
  list: (token: string) => apiClient.get<BackendCredential[]>("/school/credentials", token),
  issue: (token: string, payload: { studentId: string; type: string; classification?: string }) =>
    apiClient.post<BackendCredential>("/school/credentials", payload, token),
};

/** Public — no token required. Used by Guest mode, Alumni, University,
 * and Government diploma verification pages. */
export const publicCredentialsApi = {
  verify: (query: string) => apiClient.get<VerificationResult>(`/credentials/verify?query=${encodeURIComponent(query)}`),
};
