import { useNavigate } from "react-router-dom";
import { GraduationCap, UserPlus, LogIn, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { setAuthMode } from "@/store/authSlice";

export function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const go = (mode: "login" | "register") => {
    dispatch(setAuthMode(mode));
    navigate("/onboarding/role");
  };

  const continueAsGuest = () => {
    dispatch(setAuthMode("guest"));
    navigate("/guest/diploma-verification");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 dark:bg-paper-dark">
      <div className="seal mb-6 !h-14 !w-14 !border-ink !text-ink dark:!border-white dark:!text-white">
        <GraduationCap className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-semibold">Welcome to CampusFound</h1>
      <p className="mt-1 text-sm text-ink-300">Smart Education. Safe Future.</p>

      <div className="mt-8 w-full max-w-xs space-y-3">
        <Button className="w-full" onClick={() => go("login")}>
          <LogIn className="h-4 w-4" /> Login
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => go("register")}>
          <UserPlus className="h-4 w-4" /> Create Account
        </Button>
        <Button variant="ghost" className="w-full" onClick={continueAsGuest}>
          <Compass className="h-4 w-4" /> Continue as Guest
        </Button>
        <p className="pt-1 text-center text-[11px] text-ink-300">
          Guest access is limited to public services such as diploma verification.
        </p>
      </div>
    </div>
  );
}
