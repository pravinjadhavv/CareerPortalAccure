import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { ChooseRolePage } from './pages/ChooseRolePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterCandidatePage } from './pages/RegisterCandidatePage'
import { RegisterCompanyPage } from './pages/RegisterCompanyPage'
import { CandidateProfileEditPage } from './pages/candidate/CandidateProfileEditPage'
import { CandidateJobsPage } from './pages/candidate/CandidateJobsPage'
import { CandidateApplyPage } from './pages/candidate/CandidateApplyPage'
import { CompanyDashboardPage } from './pages/company/CompanyDashboardPage'
import { CompanyPostJobPage } from './pages/company/CompanyPostJobPage'
import { CompanyApplicantsPage } from './pages/company/CompanyApplicantsPage'
import { AdminCandidateReportPage } from './pages/admin/AdminCandidateReportPage'
import { AdminCompanyReportPage } from './pages/admin/AdminCompanyReportPage'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { RequireRole } from './components/RequireRole'
import { CompanyProfilePage } from './pages/company/CompanyProfilePage'
import { CompanyProfileEditPage } from './pages/company/CompanyProfileEditPage'

export default function App() {
  return (
    <div className="min-h-full bg-gradient-to-r from-sky-100 via-slate-100 to-rose-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<ChooseRolePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/candidate" element={<RegisterCandidatePage />} />
        <Route path="/register/company" element={<RegisterCompanyPage />} />

        <Route
          path="/candidate/profile"
          element={
            <RequireRole role="CANDIDATE">
              <CandidateProfileEditPage />
            </RequireRole>
          }
        />
        <Route
          path="/jobs"
          element={
            <RequireRole role="CANDIDATE">
              <CandidateJobsPage />
            </RequireRole>
          }
        />
        <Route
          path="/jobs/:jobId/apply"
          element={
            <RequireRole role="CANDIDATE">
              <CandidateApplyPage />
            </RequireRole>
          }
        />

        <Route
          path="/company/profile"
          element={
            <RequireRole role="COMPANY">
              <CompanyProfilePage />
            </RequireRole>
          }
        />
        <Route
          path="/company/profile/edit"
          element={
            <RequireRole role="COMPANY">
              <CompanyProfileEditPage />
            </RequireRole>
          }
        />
        <Route
          path="/company/dashboard"
          element={
            <RequireRole role="COMPANY">
              <CompanyDashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/company/post-job"
          element={
            <RequireRole role="COMPANY">
              <CompanyPostJobPage />
            </RequireRole>
          }
        />
        <Route
          path="/company/jobs/:jobId/applicants"
          element={
            <RequireRole role="COMPANY">
              <CompanyApplicantsPage />
            </RequireRole>
          }
        />

        <Route
          path="/admin/report/candidates"
          element={
            <RequireRole role="ADMIN">
              <AdminCandidateReportPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/report/companies"
          element={
            <RequireRole role="ADMIN">
              <AdminCompanyReportPage />
            </RequireRole>
          }
        />

        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

