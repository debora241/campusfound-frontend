import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setTokens, setBackendUser, setRole } from "@/store/authSlice";
import { authApi } from "@/lib/authApi";
import { tokenStorage } from "@/lib/tokenStorage";
import { ROLE_DASHBOARD_PATH, type Role } from "@/config/navigation";

export function SplashScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const refreshToken = tokenStorage.getRefreshToken();
      let accessToken = tokenStorage.getAccessToken();
      if (!refreshToken || !accessToken) return false;

      try {
        const user = await authApi.me(accessToken);
        if (cancelled) return true;
        dispatch(setTokens({ accessToken, refreshToken }));
        dispatch(setBackendUser(user));
        dispatch(setRole(user.dashboardRole as Role));
        navigate(ROLE_DASHBOARD_PATH[user.dashboardRole as Role]);
        return true;
      } catch {
        // Access token likely expired — try refreshing once before giving up.
        try {
          const refreshed = await authApi.refresh(refreshToken);
          accessToken = refreshed.accessToken;
          const user = await authApi.me(accessToken);
          if (cancelled) return true;
          tokenStorage.save(accessToken, refreshToken);
          dispatch(setTokens({ accessToken, refreshToken }));
          dispatch(setBackendUser(user));
          dispatch(setRole(user.dashboardRole as Role));
          navigate(ROLE_DASHBOARD_PATH[user.dashboardRole as Role]);
          return true;
        } catch {
          tokenStorage.clear();
          return false;
        }
      }
    }

    restoreSession().then((restored) => {
      if (!restored && !cancelled) {
        setTimeout(() => !cancelled && navigate("/onboarding"), 1600);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold"
      >
        <GraduationCap className="h-9 w-9 text-gold" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-2xl font-semibold tracking-tight"
      >
        CampusFound
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-2 text-sm text-white/60"
      >
        Smart Education. Safe Future.
      </motion.p>
    </div>
  );
}
