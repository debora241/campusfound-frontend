import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { enableBiometric, setBackendUser } from "@/store/authSlice";
import { authApi } from "@/lib/authApi";

export function BiometricLogin() {
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const enroll = () => {
    setStatus("scanning");
    setTimeout(async () => {
      setStatus("success");
      dispatch(enableBiometric());
      if (accessToken) {
        try {
          const updatedUser = await authApi.enableBiometric(accessToken);
          dispatch(setBackendUser(updatedUser));
        } catch {
          // Non-blocking — biometric is a nice-to-have, don't stop onboarding over it.
        }
      }
      setTimeout(() => navigate("/auth/complete-profile"), 700);
    }, 1400);
  };

  return (
    <AuthLayout title="Set up biometric login" subtitle="Sign in faster next time using your fingerprint or face.">
      <div className="flex flex-col items-center py-4">
        <motion.button
          onClick={enroll}
          disabled={status !== "idle"}
          animate={status === "scanning" ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: status === "scanning" ? Infinity : 0, duration: 1 }}
          className={`flex h-24 w-24 items-center justify-center rounded-full border-2 transition-colors ${
            status === "success" ? "border-verified text-verified" : "border-gold text-gold"
          }`}
        >
          <Fingerprint className="h-10 w-10" />
        </motion.button>
        <p className="mt-4 text-sm text-ink-300">
          {status === "idle" && "Tap to scan"}
          {status === "scanning" && "Scanning…"}
          {status === "success" && "Biometric login enabled"}
        </p>
      </div>

      <Button variant="secondary" className="w-full" onClick={() => navigate("/auth/complete-profile")}>
        Skip for now
      </Button>
    </AuthLayout>
  );
}
