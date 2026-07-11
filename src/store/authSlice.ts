import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "@/config/navigation";
import type { AuthRole } from "@/config/authRoles";

export type Language = "en" | "fr";
export type AuthMode = "login" | "register" | "guest";

interface AuthState {
  language: Language | null;
  authMode: AuthMode | null;
  authRole: AuthRole | null;
  selectedRole: Role | null;
  ministry: string | null;
  phone: string | null;
  otpVerified: boolean;
  biometricEnabled: boolean;
  isAuthenticated: boolean;
  profile: Record<string, string> | null;
  profileCompleted: boolean;
  loginMethod: "phone" | "id" | "otp" | "credentials" | null;
  accessToken: string | null;
  refreshToken: string | null;
  backendUser: Record<string, unknown> | null;
  pendingUserId: string | null;
  authError: string | null;
}

const initialState: AuthState = {
  language: null,
  authMode: null,
  authRole: null,
  selectedRole: null,
  ministry: null,
  phone: null,
  otpVerified: false,
  biometricEnabled: false,
  isAuthenticated: false,
  profile: null,
  profileCompleted: false,
  loginMethod: null,
  accessToken: null,
  refreshToken: null,
  backendUser: null,
  pendingUserId: null,
  authError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    setAuthMode(state, action: PayloadAction<AuthMode>) {
      state.authMode = action.payload;
    },
    setAuthRole(state, action: PayloadAction<AuthRole>) {
      state.authRole = action.payload;
    },
    setRole(state, action: PayloadAction<Role>) {
      state.selectedRole = action.payload;
    },
    setMinistry(state, action: PayloadAction<string>) {
      state.ministry = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setProfile(state, action: PayloadAction<Record<string, string>>) {
      state.profile = { ...state.profile, ...action.payload };
    },
    verifyOtp(state) {
      state.otpVerified = true;
      state.isAuthenticated = true;
      state.loginMethod = "otp";
    },
    loginWithId(state) {
      state.isAuthenticated = true;
      state.loginMethod = "credentials";
    },
    enableBiometric(state) {
      state.biometricEnabled = true;
    },
    completeProfile(state) {
      state.profileCompleted = true;
    },
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setBackendUser(state, action: PayloadAction<Record<string, unknown>>) {
      state.backendUser = action.payload;
    },
    setPendingUserId(state, action: PayloadAction<string>) {
      state.pendingUserId = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.authError = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const {
  setLanguage,
  setAuthMode,
  setAuthRole,
  setRole,
  setMinistry,
  setPhone,
  setProfile,
  verifyOtp,
  loginWithId,
  enableBiometric,
  completeProfile,
  setTokens,
  setBackendUser,
  setPendingUserId,
  setAuthError,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
