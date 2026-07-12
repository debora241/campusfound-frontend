import type { AppDispatch } from "@/store";
import { setTokens, setBackendUser, setRole } from "@/store/authSlice";
import { authApi } from "@/lib/authApi";
import { tokenStorage } from "@/lib/tokenStorage";
import type { Role } from "@/config/navigation";

/** Restores a session from the tokens saved in localStorage — tries the
 * stored access token first, falls back to a refresh, and clears storage
 * if both fail. Shared by SplashScreen (first load) and AppShell (any
 * dashboard route hit directly, e.g. via reload or a bookmark). */
export async function restoreSession(dispatch: AppDispatch): Promise<Role | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  let accessToken = tokenStorage.getAccessToken();
  if (!refreshToken || !accessToken) return null;

  try {
    const user = await authApi.me(accessToken);
    dispatch(setTokens({ accessToken, refreshToken }));
    dispatch(setBackendUser(user));
    dispatch(setRole(user.dashboardRole as Role));
    return user.dashboardRole as Role;
  } catch {
    try {
      const refreshed = await authApi.refresh(refreshToken);
      accessToken = refreshed.accessToken;
      const user = await authApi.me(accessToken);
      tokenStorage.save(accessToken, refreshToken);
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setBackendUser(user));
      dispatch(setRole(user.dashboardRole as Role));
      return user.dashboardRole as Role;
    } catch {
      tokenStorage.clear();
      return null;
    }
  }
}
