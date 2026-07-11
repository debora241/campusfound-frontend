import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { AUTH_ROLE_META, AUTH_ROLE_TO_DASHBOARD_ROLE, type AuthRole } from "@/config/authRoles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAuthRole, setRole } from "@/store/authSlice";
import { cn } from "@/lib/utils";

const ORDER: AuthRole[] = [
  "nursery",
  "primary",
  "secondary",
  "university_student",
  "parent",
  "teacher",
  "school_admin",
  "university_admin",
  "police",
  "government",
  "health_partner",
  "alumni",
];

export function RoleSelect() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authMode = useAppSelector((s) => s.auth.authMode);

  const handleSelect = (authRole: AuthRole) => {
    dispatch(setAuthRole(authRole));
    dispatch(setRole(AUTH_ROLE_TO_DASHBOARD_ROLE[authRole]));
    navigate("/auth/login");
  };

  return (
    <AuthLayout
      title={authMode === "register" ? "Create an account as…" : "I am a…"}
      subtitle="Choose how you'll use CampusFound."
      step={2}
      totalSteps={4}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {ORDER.map((role) => {
          const meta = AUTH_ROLE_META[role];
          return (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-md border border-line px-3 py-3 text-left text-xs transition-colors hover:border-ink dark:border-line-dark dark:hover:border-white"
              )}
            >
              <span className="text-lg leading-none">{meta.emoji}</span>
              <span className="font-medium leading-tight">{meta.label}</span>
              {meta.description && <span className="text-[10px] leading-tight text-ink-300">{meta.description}</span>}
            </button>
          );
        })}
      </div>
    </AuthLayout>
  );
}
