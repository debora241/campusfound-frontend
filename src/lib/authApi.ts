import { apiClient } from "./apiClient";

export interface RegisterPayload {
  authRole: string;
  fullName: string;
  email?: string;
  phone?: string;
  externalId?: string;
  institutionCode?: string;
  ministry?: string;
  password: string;
  dateOfBirth?: string;
  className?: string;
  program?: string;
  department?: string;
  subjects?: string;
}

export interface LoginPayload {
  authRole: string;
  identifier: string;
  password: string;
  institutionCode?: string;
}

export interface LoginResult {
  requiresOtp: boolean;
  userId?: string;
  user?: BackendUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface BackendUser {
  id: string;
  email: string | null;
  phone: string | null;
  externalId: string | null;
  institutionCode: string | null;
  dashboardRole: string;
  authRole: string | null;
  preferredLanguage: string;
  biometricEnabled: boolean;
  profileCompleted: boolean;
  profile?: { fullName: string } | null;
}

export interface OtpVerifyResult {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (payload: RegisterPayload) => apiClient.post<BackendUser>("/auth/register", payload),

  login: (payload: LoginPayload) => apiClient.post<LoginResult>("/auth/login", payload),

  requestOtp: (payload: { phone?: string; userId?: string; authRole?: string }) =>
    apiClient.post<{ requiresOtp: true }>("/auth/otp/request", payload),

  verifyOtp: (payload: { phone?: string; userId?: string; code: string }) =>
    apiClient.post<OtpVerifyResult>("/auth/otp/verify", payload),

  refresh: (refreshToken: string) => apiClient.post<{ accessToken: string }>("/auth/refresh", { refreshToken }),

  logout: (refreshToken: string) => apiClient.post<{ loggedOut: true }>("/auth/logout", { refreshToken }),

  forgotPassword: (identifier: string) => apiClient.post<{ sent: true }>("/auth/forgot-password", { identifier }),

  resetPassword: (payload: { identifier: string; code: string; newPassword: string }) =>
    apiClient.post<{ reset: true }>("/auth/reset-password", payload),

  me: (token: string) => apiClient.get<BackendUser>("/auth/me", token),

  updateProfile: (token: string, payload: Record<string, string | undefined>) =>
    apiClient.patch<BackendUser>("/auth/profile", payload, token),

  enableBiometric: (token: string) => apiClient.post<BackendUser>("/auth/biometric/enable", undefined, token),
};
