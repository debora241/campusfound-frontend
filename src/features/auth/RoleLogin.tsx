import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { InstitutionCodeInput } from "./InstitutionCodeInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AUTH_CONFIG, type LoginField, type LoginOption } from "@/config/authConfig";
import { AUTH_ROLE_META } from "@/config/authRoles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPhone, setProfile, setMinistry, setTokens, setBackendUser, setPendingUserId } from "@/store/authSlice";
import { authApi } from "@/lib/authApi";
import { toRegisterPayload, toLoginCredentials, extractOtpPhone } from "@/lib/authFieldMapping";
import { tokenStorage } from "@/lib/tokenStorage";
import { ApiError } from "@/lib/apiClient";

const MINISTRIES = ["MINEDUB — Basic Education", "MINESEC — Secondary Education", "MINESUP — Higher Education"];
const NURSERY_METHODS = [
  { id: "password", label: "Parent password" },
  { id: "pin", label: "Parent PIN" },
  { id: "otp", label: "Parent OTP" },
] as const;

function buildSchema(fields: LoginField[], extra: string[] = []) {
  const shape: Record<string, z.ZodTypeAny> = {};
  [...fields.map((f) => f.name), ...extra].forEach((name) => {
    shape[name] = z.string().min(1, "This field is required");
  });
  return z.object(shape);
}

export function RoleLogin() {
  const authRole = useAppSelector((s) => s.auth.authRole);
  const authMode = useAppSelector((s) => s.auth.authMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const config = authRole ? AUTH_CONFIG[authRole] : null;
  const [optionId, setOptionId] = useState(config?.options[0]?.id ?? "");
  const [nurseryMethod, setNurseryMethod] = useState<(typeof NURSERY_METHODS)[number]["id"]>("password");
  const [wantsOtpToo, setWantsOtpToo] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const activeOption: LoginOption | undefined = config?.options.find((o) => o.id === optionId);

  const nurseryFields: LoginField[] = [
    { name: "school", label: "School name" },
    { name: "admissionNumber", label: "Admission number" },
    { name: "dob", label: "Child's date of birth", type: "date" },
  ];
  const nurseryMethodField: LoginField =
    nurseryMethod === "password"
      ? { name: "parentPassword", label: "Parent password", type: "password" }
      : nurseryMethod === "pin"
      ? { name: "parentPin", label: "Parent PIN", placeholder: "4–6 digits" }
      : { name: "parentPhone", label: "Parent phone number", type: "tel", placeholder: "+237 6XX XXX XXX" };

  const activeFields: LoginField[] =
    config?.specialFlow === "nursery" ? [...nurseryFields, nurseryMethodField] : activeOption?.fields ?? [];

  const extraRequired =
    config?.specialFlow === "government" ? ["ministry"] : authMode === "register" ? ["fullName"] : [];
  const schema = useMemo(() => buildSchema(activeFields, extraRequired), [activeFields, extraRequired]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({ resolver: zodResolver(schema) });

  if (!authRole || !config) {
    navigate("/onboarding/role");
    return null;
  }

  const meta = AUTH_ROLE_META[authRole];

  const switchOption = (id: string) => {
    setOptionId(id);
    reset();
    setServerError(null);
  };

  const onSubmit = async (values: Record<string, string>) => {
    setServerError(null);
    dispatch(setProfile(values));
    if (values.ministry) dispatch(setMinistry(values.ministry));

    const isPhoneOtpFlow =
      (config.specialFlow === "nursery" && nurseryMethod === "otp") || (activeOption?.usesOtp && !activeOption.fields.some((f) => f.name === "password"));

    try {
      if (authMode === "register") {
        const payload = toRegisterPayload(authRole, values.fullName ?? meta.label, values);
        await authApi.register(payload);
        toast.success("Account created — signing you in…");
      }

      if (isPhoneOtpFlow) {
        const phone = extractOtpPhone(values);
        if (!phone) throw new ApiError("Enter a phone number", 422);
        dispatch(setPhone(phone));
        await authApi.requestOtp({ phone, authRole });
        toast.success("Verification code sent");
        navigate("/auth/otp");
        return;
      }

      const credentials = toLoginCredentials(authRole, values);
      const result = await authApi.login(credentials);

      if (result.requiresOtp) {
        if (result.userId) dispatch(setPendingUserId(result.userId));
        toast.success("Verification code sent");
        navigate("/auth/otp");
        return;
      }

      if (result.accessToken && result.refreshToken && result.user) {
        dispatch(setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken }));
        dispatch(setBackendUser(result.user));
        tokenStorage.save(result.accessToken, result.refreshToken);
      }

      toast.success(`Welcome${authMode === "register" ? "" : " back"}, ${meta.label}`);
      navigate("/auth/biometric");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title={`${meta.label} ${authMode === "register" ? "sign up" : "sign in"}`}
      subtitle={config.mandatoryOtp ? "Two-factor authentication is required for this role." : "Choose how you'd like to continue."}
      step={3}
      totalSteps={4}
    >
      {config.options.length > 1 && (
        <div className="mb-4 flex gap-1.5 rounded-md bg-ink-50 p-1 dark:bg-white/5">
          {config.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => switchOption(opt.id)}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                opt.id === optionId ? "bg-white shadow-sm dark:bg-ink-900" : "text-ink-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {config.specialFlow === "nursery" && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-medium text-ink-500 dark:text-ink-300">Parent confirms access via</p>
          <div className="flex gap-1.5 rounded-md bg-ink-50 p-1 dark:bg-white/5">
            {NURSERY_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setNurseryMethod(m.id);
                  reset();
                  setServerError(null);
                }}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  m.id === nurseryMethod ? "bg-white shadow-sm dark:bg-ink-900" : "text-ink-300"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {authMode === "register" && (
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" error={errors.fullName?.message as string} {...register("fullName")} />
          </div>
        )}

        {config.specialFlow === "nursery" && (
          <p className="text-xs text-ink-300">Enter the child's details, then confirm as the parent below.</p>
        )}

        {activeFields.map((field) => {
          const isInstitutionField = ["school", "institution", "schoolCode", "institutionCode", "facilityCode"].includes(field.name);
          return (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {isInstitutionField ? (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=""
                  render={({ field: rhfField }) => (
                    <InstitutionCodeInput
                      value={rhfField.value ?? ""}
                      onChange={rhfField.onChange}
                      placeholder={field.placeholder ?? "Search by name or code…"}
                      error={errors[field.name]?.message as string}
                    />
                  )}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type === "date" ? "date" : field.type ?? "text"}
                  placeholder={field.placeholder}
                  error={errors[field.name]?.message as string}
                  {...register(field.name)}
                />
              )}
            </div>
          );
        })}

        {config.specialFlow === "government" && (
          <div>
            <Label htmlFor="ministry">Ministry</Label>
            <select
              id="ministry"
              className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
              {...register("ministry")}
              defaultValue=""
            >
              <option value="" disabled>
                Select your ministry
              </option>
              {MINISTRIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.ministry && <p className="mt-1.5 text-xs text-alert">{errors.ministry.message as string}</p>}
          </div>
        )}

        {activeOption?.optionalOtp && (
          <label className="flex items-center gap-2 text-xs text-ink-300">
            <input type="checkbox" className="h-3.5 w-3.5" checked={wantsOtpToo} onChange={(e) => setWantsOtpToo(e.target.checked)} />
            Also verify with an OTP for extra security
          </label>
        )}

        {config.mandatoryOtp && (
          <div className="flex items-start gap-2 rounded-md bg-gold-light/50 p-3 text-xs text-gold-dark">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This role requires two-factor authentication. You'll be asked for a one-time code after this step.
          </div>
        )}

        {serverError && (
          <div className="rounded-md bg-alert-light px-3 py-2 text-xs text-alert">{serverError}</div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Continuing…" : "Continue"}
        </Button>

        <p className="text-center text-[11px] text-ink-300">
          Requires the CampusFound backend running at{" "}
          <code>{import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"}</code>
        </p>
      </form>
    </AuthLayout>
  );
}
