import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { AccountShell } from "@/layouts/AccountShell";

const StudentDashboard = lazy(() => import("@/features/student/dashboard/StudentDashboard").then((m) => ({ default: m.StudentDashboard })));
const Courses = lazy(() => import("@/features/student/Courses").then((m) => ({ default: m.Courses })));
const StudentAssignments = lazy(() => import("@/features/student/Assignments").then((m) => ({ default: m.Assignments })));
const StudentGrades = lazy(() => import("@/features/student/Grades").then((m) => ({ default: m.Grades })));
const CareerGuidance = lazy(() => import("@/features/student/CareerGuidance").then((m) => ({ default: m.CareerGuidance })));
const StudentLibrary = lazy(() => import("@/features/student/Library").then((m) => ({ default: m.Library })));
const SkillPassport = lazy(() => import("@/features/student/SkillPassport").then((m) => ({ default: m.SkillPassport })));
const Portfolio = lazy(() => import("@/features/student/Portfolio").then((m) => ({ default: m.Portfolio })));
const Community = lazy(() => import("@/features/student/Community").then((m) => ({ default: m.Community })));
const Wallet = lazy(() => import("@/features/student/Wallet").then((m) => ({ default: m.Wallet })));
const StudentMessages = lazy(() => import("@/features/student/Messages").then((m) => ({ default: m.Messages })));
const StudentCalendar = lazy(() => import("@/features/student/Calendar").then((m) => ({ default: m.Calendar })));

const SplashScreen = lazy(() => import("@/features/auth/SplashScreen").then((m) => ({ default: m.SplashScreen })));
const Onboarding = lazy(() => import("@/features/auth/Onboarding").then((m) => ({ default: m.Onboarding })));
const LanguageSelect = lazy(() => import("@/features/auth/LanguageSelect").then((m) => ({ default: m.LanguageSelect })));
const WelcomeScreen = lazy(() => import("@/features/auth/WelcomeScreen").then((m) => ({ default: m.WelcomeScreen })));
const RoleSelect = lazy(() => import("@/features/auth/RoleSelect").then((m) => ({ default: m.RoleSelect })));
const RoleLogin = lazy(() => import("@/features/auth/RoleLogin").then((m) => ({ default: m.RoleLogin })));
const OtpVerification = lazy(() => import("@/features/auth/OtpVerification").then((m) => ({ default: m.OtpVerification })));
const BiometricLogin = lazy(() => import("@/features/auth/BiometricLogin").then((m) => ({ default: m.BiometricLogin })));
const CompleteProfile = lazy(() => import("@/features/auth/CompleteProfile").then((m) => ({ default: m.CompleteProfile })));
const ForgotPassword = lazy(() => import("@/features/auth/ForgotPassword").then((m) => ({ default: m.ForgotPassword })));
const GuestDiplomaVerification = lazy(() => import("@/features/auth/GuestDiplomaVerification").then((m) => ({ default: m.GuestDiplomaVerification })));

const SecuritySettings = lazy(() => import("@/features/account/SecuritySettings").then((m) => ({ default: m.SecuritySettings })));
const DeviceManagement = lazy(() => import("@/features/account/DeviceManagement").then((m) => ({ default: m.DeviceManagement })));
const SessionManagement = lazy(() => import("@/features/account/SessionManagement").then((m) => ({ default: m.SessionManagement })));

const SchoolDashboard = lazy(() => import("@/features/school/SchoolDashboard").then((m) => ({ default: m.SchoolDashboard })));
const Students = lazy(() => import("@/features/school/Students").then((m) => ({ default: m.Students })));
const Teachers = lazy(() => import("@/features/school/Teachers").then((m) => ({ default: m.Teachers })));
const Admissions = lazy(() => import("@/features/school/Admissions").then((m) => ({ default: m.Admissions })));
const Classes = lazy(() => import("@/features/school/Classes").then((m) => ({ default: m.Classes })));
const Finance = lazy(() => import("@/features/school/Finance").then((m) => ({ default: m.Finance })));
const Examinations = lazy(() => import("@/features/school/Examinations").then((m) => ({ default: m.Examinations })));
const Certificates = lazy(() => import("@/features/school/Certificates").then((m) => ({ default: m.Certificates })));
const Library = lazy(() => import("@/features/school/Library").then((m) => ({ default: m.Library })));
const Transport = lazy(() => import("@/features/school/Transport").then((m) => ({ default: m.Transport })));
const Discipline = lazy(() => import("@/features/school/Discipline").then((m) => ({ default: m.Discipline })));
const Announcements = lazy(() => import("@/features/school/Announcements").then((m) => ({ default: m.Announcements })));
const SchoolSettings = lazy(() => import("@/features/school/SchoolSettings").then((m) => ({ default: m.SchoolSettings })));

const ParentDashboard = lazy(() => import("@/features/parent/ParentDashboard").then((m) => ({ default: m.ParentDashboard })));
const ChildrenOverview = lazy(() => import("@/features/parent/ChildrenOverview").then((m) => ({ default: m.ChildrenOverview })));
const ParentAttendance = lazy(() => import("@/features/parent/Attendance").then((m) => ({ default: m.Attendance })));
const Grades = lazy(() => import("@/features/parent/Grades").then((m) => ({ default: m.Grades })));
const Payments = lazy(() => import("@/features/parent/Payments").then((m) => ({ default: m.Payments })));
const TransportTracking = lazy(() => import("@/features/parent/TransportTracking").then((m) => ({ default: m.TransportTracking })));
const Health = lazy(() => import("@/features/parent/Health").then((m) => ({ default: m.Health })));
const Messages = lazy(() => import("@/features/parent/Messages").then((m) => ({ default: m.Messages })));
const EmergencyAlerts = lazy(() => import("@/features/parent/EmergencyAlerts").then((m) => ({ default: m.EmergencyAlerts })));

const TeacherDashboard = lazy(() => import("@/features/teacher/TeacherDashboard").then((m) => ({ default: m.TeacherDashboard })));
const TeacherClasses = lazy(() => import("@/features/teacher/TeacherClasses").then((m) => ({ default: m.TeacherClasses })));
const TeacherAttendance = lazy(() => import("@/features/teacher/TeacherAttendance").then((m) => ({ default: m.TeacherAttendance })));
const TeacherAssignments = lazy(() => import("@/features/teacher/Assignments").then((m) => ({ default: m.Assignments })));
const Grading = lazy(() => import("@/features/teacher/Grading").then((m) => ({ default: m.Grading })));
const Timetable = lazy(() => import("@/features/teacher/Timetable").then((m) => ({ default: m.Timetable })));
const TeacherMessages = lazy(() => import("@/features/teacher/TeacherMessages").then((m) => ({ default: m.TeacherMessages })));

const UniversityDashboard = lazy(() => import("@/features/university/UniversityDashboard").then((m) => ({ default: m.UniversityDashboard })));
const UniversityStudents = lazy(() => import("@/features/university/UniversityStudents").then((m) => ({ default: m.UniversityStudents })));
const UniversityFaculty = lazy(() => import("@/features/university/UniversityFaculty").then((m) => ({ default: m.UniversityFaculty })));
const Programs = lazy(() => import("@/features/university/Programs").then((m) => ({ default: m.Programs })));
const UniversityExaminations = lazy(() => import("@/features/university/UniversityExaminations").then((m) => ({ default: m.UniversityExaminations })));
const Diplomas = lazy(() => import("@/features/university/Diplomas").then((m) => ({ default: m.Diplomas })));
const UniversityFinance = lazy(() => import("@/features/university/UniversityFinance").then((m) => ({ default: m.UniversityFinance })));
const UniversitySettings = lazy(() => import("@/features/university/UniversitySettings").then((m) => ({ default: m.UniversitySettings })));

const PoliceDashboard = lazy(() => import("@/features/police/PoliceDashboard").then((m) => ({ default: m.PoliceDashboard })));
const SosAlerts = lazy(() => import("@/features/police/SosAlerts").then((m) => ({ default: m.SosAlerts })));
const MissingStudents = lazy(() => import("@/features/police/MissingStudents").then((m) => ({ default: m.MissingStudents })));
const Geofencing = lazy(() => import("@/features/police/Geofencing").then((m) => ({ default: m.Geofencing })));
const QrScanner = lazy(() => import("@/features/police/QrScanner").then((m) => ({ default: m.QrScanner })));
const IncidentReports = lazy(() => import("@/features/police/IncidentReports").then((m) => ({ default: m.IncidentReports })));
const ResponseHistory = lazy(() => import("@/features/police/ResponseHistory").then((m) => ({ default: m.ResponseHistory })));

const NationalDashboard = lazy(() => import("@/features/government/NationalDashboard").then((m) => ({ default: m.NationalDashboard })));
const GovernmentSchools = lazy(() => import("@/features/government/GovernmentSchools").then((m) => ({ default: m.GovernmentSchools })));
const GovernmentUniversities = lazy(() => import("@/features/government/GovernmentUniversities").then((m) => ({ default: m.GovernmentUniversities })));
const Statistics = lazy(() => import("@/features/government/Statistics").then((m) => ({ default: m.Statistics })));
const DropoutAnalysis = lazy(() => import("@/features/government/DropoutAnalysis").then((m) => ({ default: m.DropoutAnalysis })));
const Funding = lazy(() => import("@/features/government/Funding").then((m) => ({ default: m.Funding })));
const PublicDiplomaVerification = lazy(() => import("@/features/government/PublicDiplomaVerification").then((m) => ({ default: m.PublicDiplomaVerification })));

const HealthDashboard = lazy(() => import("@/features/health/HealthDashboard").then((m) => ({ default: m.HealthDashboard })));
const MedicalRecords = lazy(() => import("@/features/health/MedicalRecords").then((m) => ({ default: m.MedicalRecords })));
const Vaccinations = lazy(() => import("@/features/health/Vaccinations").then((m) => ({ default: m.Vaccinations })));
const Telemedicine = lazy(() => import("@/features/health/Telemedicine").then((m) => ({ default: m.Telemedicine })));
const HealthSosPage = lazy(() => import("@/features/health/HealthSosPage").then((m) => ({ default: m.HealthSosPage })));
const MedicalReports = lazy(() => import("@/features/health/MedicalReports").then((m) => ({ default: m.MedicalReports })));

const AlumniDashboard = lazy(() => import("@/features/alumni/AlumniDashboard").then((m) => ({ default: m.AlumniDashboard })));
const AlumniDirectory = lazy(() => import("@/features/alumni/AlumniDirectory").then((m) => ({ default: m.AlumniDirectory })));
const AlumniDiplomaVerification = lazy(() => import("@/features/alumni/AlumniDiplomaVerification").then((m) => ({ default: m.AlumniDiplomaVerification })));
const Mentorship = lazy(() => import("@/features/alumni/Mentorship").then((m) => ({ default: m.Mentorship })));
const AlumniEvents = lazy(() => import("@/features/alumni/AlumniEvents").then((m) => ({ default: m.AlumniEvents })));

const SuperAdminDashboard = lazy(() => import("@/features/admin/SuperAdminDashboard").then((m) => ({ default: m.SuperAdminDashboard })));
const MultiSchoolManagement = lazy(() => import("@/features/admin/MultiSchoolManagement").then((m) => ({ default: m.MultiSchoolManagement })));
const UsersRbac = lazy(() => import("@/features/admin/UsersRbac").then((m) => ({ default: m.UsersRbac })));
const AuditLogs = lazy(() => import("@/features/admin/AuditLogs").then((m) => ({ default: m.AuditLogs })));
const SystemMonitoring = lazy(() => import("@/features/admin/SystemMonitoring").then((m) => ({ default: m.SystemMonitoring })));
const Integrations = lazy(() => import("@/features/admin/Integrations").then((m) => ({ default: m.Integrations })));
const BackupRestore = lazy(() => import("@/features/admin/BackupRestore").then((m) => ({ default: m.BackupRestore })));
const PlatformSettings = lazy(() => import("@/features/admin/PlatformSettings").then((m) => ({ default: m.PlatformSettings })));

// All 10 roles are fully built end-to-end: Student, Parent, Teacher, School
// Administration, University Administration, Police, Government, Health
// Partner, Alumni, Super Administrator — plus the complete authentication
// flow and shared account/security area. Every page is lazy-loaded so a
// visitor only downloads the role they actually use.

function RouteLoading() {
  return (
    <div className="flex h-screen items-center justify-center text-sm text-ink-300">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<SplashScreen />} />

          {/* Authentication flow */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/language" element={<LanguageSelect />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/onboarding/role" element={<RoleSelect />} />
          <Route path="/auth/login" element={<RoleLogin />} />
          <Route path="/auth/otp" element={<OtpVerification />} />
          <Route path="/auth/biometric" element={<BiometricLogin />} />
          <Route path="/auth/complete-profile" element={<CompleteProfile />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/guest/diploma-verification" element={<GuestDiplomaVerification />} />

          {/* Account & security (post-login, shared across roles) */}
          <Route path="/account" element={<AccountShell />}>
            <Route index element={<Navigate to="security" replace />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="devices" element={<DeviceManagement />} />
            <Route path="sessions" element={<SessionManagement />} />
          </Route>

          <Route path="/student" element={<AppShell role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="career-guidance" element={<CareerGuidance />} />
            <Route path="library" element={<StudentLibrary />} />
            <Route path="skill-passport" element={<SkillPassport />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="community" element={<Community />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="messages" element={<StudentMessages />} />
            <Route path="calendar" element={<StudentCalendar />} />
          </Route>

          <Route path="/school" element={<AppShell role="school_admin" />}>
            <Route index element={<SchoolDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="classes" element={<Classes />} />
            <Route path="finance" element={<Finance />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="library" element={<Library />} />
            <Route path="transport" element={<Transport />} />
            <Route path="discipline" element={<Discipline />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="settings" element={<SchoolSettings />} />
          </Route>

          <Route path="/parent" element={<AppShell role="parent" />}>
            <Route index element={<ParentDashboard />} />
            <Route path="children" element={<ChildrenOverview />} />
            <Route path="attendance" element={<ParentAttendance />} />
            <Route path="grades" element={<Grades />} />
            <Route path="payments" element={<Payments />} />
            <Route path="transport" element={<TransportTracking />} />
            <Route path="health" element={<Health />} />
            <Route path="messages" element={<Messages />} />
            <Route path="alerts" element={<EmergencyAlerts />} />
          </Route>

          <Route path="/teacher" element={<AppShell role="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="grading" element={<Grading />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="messages" element={<TeacherMessages />} />
          </Route>

          <Route path="/university" element={<AppShell role="university_admin" />}>
            <Route index element={<UniversityDashboard />} />
            <Route path="students" element={<UniversityStudents />} />
            <Route path="faculty" element={<UniversityFaculty />} />
            <Route path="programs" element={<Programs />} />
            <Route path="examinations" element={<UniversityExaminations />} />
            <Route path="diplomas" element={<Diplomas />} />
            <Route path="finance" element={<UniversityFinance />} />
            <Route path="settings" element={<UniversitySettings />} />
          </Route>

          <Route path="/police" element={<AppShell role="police" />}>
            <Route index element={<PoliceDashboard />} />
            <Route path="sos" element={<SosAlerts />} />
            <Route path="missing-students" element={<MissingStudents />} />
            <Route path="geofencing" element={<Geofencing />} />
            <Route path="qr-scanner" element={<QrScanner />} />
            <Route path="incidents" element={<IncidentReports />} />
            <Route path="history" element={<ResponseHistory />} />
          </Route>

          <Route path="/government" element={<AppShell role="government" />}>
            <Route index element={<NationalDashboard />} />
            <Route path="schools" element={<GovernmentSchools />} />
            <Route path="universities" element={<GovernmentUniversities />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="dropout-analysis" element={<DropoutAnalysis />} />
            <Route path="funding" element={<Funding />} />
            <Route path="diploma-verification" element={<PublicDiplomaVerification />} />
          </Route>

          <Route path="/health" element={<AppShell role="health_partner" />}>
            <Route index element={<HealthDashboard />} />
            <Route path="records" element={<MedicalRecords />} />
            <Route path="vaccinations" element={<Vaccinations />} />
            <Route path="telemedicine" element={<Telemedicine />} />
            <Route path="sos" element={<HealthSosPage />} />
            <Route path="reports" element={<MedicalReports />} />
          </Route>

          <Route path="/alumni" element={<AppShell role="alumni" />}>
            <Route index element={<AlumniDashboard />} />
            <Route path="network" element={<AlumniDirectory />} />
            <Route path="diploma" element={<AlumniDiplomaVerification />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="events" element={<AlumniEvents />} />
          </Route>

          <Route path="/admin" element={<AppShell role="super_admin" />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="schools" element={<MultiSchoolManagement />} />
            <Route path="rbac" element={<UsersRbac />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="monitoring" element={<SystemMonitoring />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="backup" element={<BackupRestore />} />
            <Route path="settings" element={<PlatformSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
