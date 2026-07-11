import type { AuthRole } from "@/config/authRoles";
import type { RegisterPayload, LoginPayload } from "./authApi";

type RawValues = Record<string, string | undefined>;

/** The person's own identifier, whatever this role calls it. */
function extractExternalId(values: RawValues): string | undefined {
  return (
    values.matricule ||
    values.admissionNumber ||
    values.regNumber ||
    values.staffId ||
    values.officerNumber ||
    values.employeeId ||
    values.identifier ||
    values.username ||
    undefined
  );
}

/** The institution's code, whatever this role calls it. */
function extractInstitutionCode(values: RawValues): string | undefined {
  return values.school || values.institution || values.institutionCode || values.schoolCode || values.facilityCode || undefined;
}

function extractEmail(values: RawValues): string | undefined {
  return values.email || values.govEmail || undefined;
}

function extractPhone(values: RawValues): string | undefined {
  return values.phone || values.parentPhone || undefined;
}

function extractPassword(values: RawValues): string | undefined {
  return values.password || values.parentPassword || values.parentPin || undefined;
}

export function toRegisterPayload(authRole: AuthRole, fullName: string, values: RawValues): RegisterPayload {
  return {
    authRole,
    fullName,
    email: extractEmail(values),
    phone: extractPhone(values),
    externalId: extractExternalId(values),
    institutionCode: extractInstitutionCode(values),
    ministry: values.ministry,
    password: extractPassword(values) ?? "",
    dateOfBirth: values.dob,
    className: values.className,
    program: values.program,
    department: values.department,
    subjects: values.subjects,
  };
}

export function toLoginCredentials(authRole: AuthRole, values: RawValues): LoginPayload {
  return {
    authRole,
    identifier: extractExternalId(values) ?? extractEmail(values) ?? extractPhone(values) ?? "",
    password: extractPassword(values) ?? "",
    institutionCode: extractInstitutionCode(values),
  };
}

/** For phone+OTP-only login options, there's no password — just the phone. */
export function extractOtpPhone(values: RawValues): string | undefined {
  return extractPhone(values);
}
