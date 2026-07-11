import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTokens, setBackendUser } from "@/store/authSlice";
import { authApi } from "@/lib/authApi";
import { tokenStorage } from "@/lib/tokenStorage";
import { ApiError } from "@/lib/apiClient";

const LENGTH = 6;

export function OtpVerification() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const phone = useAppSelector((s) => s.auth.phone);
  const pendingUserId = useAppSelector((s) => s.auth.pendingUserId);

  useEffect(() => {
    if (seconds === 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (i: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[i] = value;
    setDigits(next);
    setError(null);
    if (value && i < LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < LENGTH) {
      setError("Enter the full 6-digit code");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const result = await authApi.verifyOtp({
        userId: pendingUserId ?? undefined,
        phone: phone ?? undefined,
        code,
      });
      dispatch(setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken }));
      dispatch(setBackendUser(result.user));
      tokenStorage.save(result.accessToken, result.refreshToken);
      navigate("/auth/biometric");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.requestOtp({ phone: phone ?? undefined, userId: pendingUserId ?? undefined });
      setSeconds(30);
      toast.success("Code resent");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't resend the code");
    }
  };

  return (
    <AuthLayout
      title="Enter verification code"
      subtitle={phone ? `We sent a code to ${phone}` : "We sent a verification code to the contact number on file for your account."}
      step={4}
      totalSteps={4}
    >
      <div className="flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className="h-12 w-11 rounded-md border border-line text-center text-lg font-semibold outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-alert">{error}</p>}

      <Button className="mt-6 w-full" onClick={handleVerify} disabled={verifying}>
        {verifying ? "Verifying…" : "Verify"}
      </Button>

      <div className="mt-4 text-center text-xs text-ink-300">
        {seconds > 0 ? (
          <span>Resend code in 0:{seconds.toString().padStart(2, "0")}</span>
        ) : (
          <button className="font-medium text-ink underline dark:text-white" onClick={handleResend}>
            Resend code
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-300">
        In development, the code is printed to the backend server console (no real SMS is sent).
      </p>
    </AuthLayout>
  );
}
