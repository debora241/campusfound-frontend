import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProfile, completeProfile, setBackendUser } from "@/store/authSlice";
import { ROLE_DASHBOARD_PATH, type Role } from "@/config/navigation";
import { authApi } from "@/lib/authApi";
import { ApiError } from "@/lib/apiClient";

interface ProfileFieldSpec {
  name: string;
  label: string;
  placeholder?: string;
}

const PROFILE_FIELDS: Partial<Record<Role, ProfileFieldSpec[]>> = {
  student: [
    { name: "emergencyContact", label: "Emergency contact", placeholder: "Name and phone number" },
    { name: "bloodGroup", label: "Blood group", placeholder: "e.g. O+" },
  ],
  teacher: [
    { name: "department", label: "Department", placeholder: "e.g. Mathematics" },
    { name: "subjects", label: "Subjects taught", placeholder: "e.g. Algebra, Calculus" },
  ],
  parent: [
    { name: "address", label: "Home address" },
    { name: "emergencyContact", label: "Emergency contact", placeholder: "Name and phone number" },
  ],
  school_admin: [
    { name: "contactInfo", label: "School contact information", placeholder: "Phone or email" },
    { name: "academicYear", label: "Current academic year", placeholder: "e.g. 2025/2026" },
  ],
};

export function CompleteProfile() {
  const role = useAppSelector((s) => s.auth.selectedRole);
  const language = useAppSelector((s) => s.auth.language);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fields = role ? PROFILE_FIELDS[role] : undefined;

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Record<string, string>>();

  const finish = (destination: string) => {
    dispatch(completeProfile());
    navigate(destination);
  };

  useEffect(() => {
    // Roles without extra first-login fields skip straight through.
    if (role && !fields) {
      finish(ROLE_DASHBOARD_PATH[role]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (!role) {
    navigate("/onboarding/role");
    return null;
  }
  if (!fields) return null;

  const onSubmit = async (values: Record<string, string>) => {
    dispatch(setProfile({ ...values, preferredLanguage: language ?? "en" }));

    if (accessToken) {
      try {
        const updatedUser = await authApi.updateProfile(accessToken, { ...values, preferredLanguage: language ?? "en" });
        dispatch(setBackendUser(updatedUser));
        toast.success("Profile completed");
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Couldn't save your profile — you can update it later in Settings.");
      }
    } else {
      toast.success("Profile completed");
    }

    finish(ROLE_DASHBOARD_PATH[role]);
  };

  return (
    <AuthLayout title="Complete your profile" subtitle="Just a few more details before you get started.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {fields.map((f) => (
          <div key={f.name}>
            <Label htmlFor={f.name}>{f.label}</Label>
            <Input id={f.name} placeholder={f.placeholder} {...register(f.name)} />
          </div>
        ))}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => finish(ROLE_DASHBOARD_PATH[role])}>
            Skip for now
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Finish"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
