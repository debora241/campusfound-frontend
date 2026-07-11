import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/store/hooks";
import type { AuthRole } from "@/config/authRoles";
import { authApi } from "@/lib/authApi";
import { ApiError } from "@/lib/apiClient";
import { toast } from "sonner";

interface RecoveryCopy {
  description: string;
  fieldLabel: string;
  placeholder?: string;
}

const RECOVERY: Partial<Record<AuthRole, RecoveryCopy>> = {
  nursery: { description: "Recovery for pupils goes through a parent or the school office.", fieldLabel: "Parent's phone number" },
  primary: { description: "Recovery for pupils goes through a parent or the school office.", fieldLabel: "Parent's phone number" },
  secondary: { description: "You can recover access via your parent's phone number or your school administration.", fieldLabel: "Parent's phone number or school email" },
  university_student: { description: "You can recover access via your registered phone number or institutional email.", fieldLabel: "Phone number or institutional email" },
  parent: { description: "We'll send a one-time code to your registered phone number.", fieldLabel: "Phone number", placeholder: "+237 6XX XXX XXX" },
  teacher: { description: "Recover via your staff email or your school administrator.", fieldLabel: "Staff email" },
  school_admin: { description: "Recovery requires your institutional email and two-factor authentication.", fieldLabel: "Institutional email" },
  university_admin: { description: "Recovery requires your institutional email and two-factor authentication.", fieldLabel: "Institutional email" },
  police: { description: "Recovery requires your institutional email and two-factor authentication.", fieldLabel: "Institutional email" },
  government: { description: "Recovery requires your institutional email and two-factor authentication.", fieldLabel: "Government email" },
  health_partner: { description: "Recover via your registered facility email.", fieldLabel: "Facility email" },
  alumni: { description: "Recover via your alumni email.", fieldLabel: "Alumni email" },
};

const DEFAULT_RECOVERY: RecoveryCopy = { description: "Enter your phone number, email, or ID and we'll send you a reset code.", fieldLabel: "Phone number, email, or ID" };

const requestSchema = z.object({ identifier: z.string().min(3, "This field is required") });
type RequestValues = z.infer<typeof requestSchema>;

const resetSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
  newPassword: z.string().min(4, "At least 4 characters"),
});
type ResetValues = z.infer<typeof resetSchema>;

export function ForgotPassword() {
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [identifier, setIdentifier] = useState("");
  const authRole = useAppSelector((s) => s.auth.authRole);
  const copy = (authRole && RECOVERY[authRole]) || DEFAULT_RECOVERY;

  const requestForm = useForm<RequestValues>({ resolver: zodResolver(requestSchema) });
  const resetForm = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onRequestSubmit = async (values: RequestValues) => {
    try {
      await authApi.forgotPassword(values.identifier);
      setIdentifier(values.identifier);
      setStep("reset");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  const onResetSubmit = async (values: ResetValues) => {
    try {
      await authApi.resetPassword({ identifier, code: values.code, newPassword: values.newPassword });
      setStep("done");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Invalid or expired code");
    }
  };

  if (step === "done") {
    return (
      <AuthLayout title="Password updated" subtitle="You can now sign in with your new password.">
        <div className="flex flex-col items-center py-4 text-center">
          <MailCheck className="h-10 w-10 text-verified" />
          <Link to="/auth/login" className="mt-6 text-sm font-medium text-ink underline dark:text-white">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (step === "reset") {
    return (
      <AuthLayout title="Enter your reset code" subtitle={`We sent a 6-digit code to ${identifier}. It expires in 5 minutes.`}>
        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="code">Reset code</Label>
            <Input id="code" inputMode="numeric" placeholder="123456" error={resetForm.formState.errors.code?.message} {...resetForm.register("code")} />
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" error={resetForm.formState.errors.newPassword?.message} {...resetForm.register("newPassword")} />
          </div>
          <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
            {resetForm.formState.isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle={copy.description}>
      <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="identifier">{copy.fieldLabel}</Label>
          <Input
            id="identifier"
            placeholder={copy.placeholder}
            error={requestForm.formState.errors.identifier?.message}
            {...requestForm.register("identifier")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={requestForm.formState.isSubmitting}>
          {requestForm.formState.isSubmitting ? "Sending…" : "Send reset code"}
        </Button>

        <Link to="/auth/login" className="mt-4 block text-center text-xs font-medium text-ink underline dark:text-white">
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
