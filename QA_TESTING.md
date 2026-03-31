## QA Testing Guide (CareerPortal)

This guide matches the screenshot flow and validates the full happy path + role security.

### 1) Demo seed data (optional)

Backend supports a demo seeder that inserts:
- **3 companies**
- **2 candidates**
- **5 jobs**

Enable it by setting in:
`backend/career-portal/src/main/resources/application.properties`

`app.demo.seed=true`

Then restart the backend.

Demo credentials:
- Companies: `demo_company1`, `demo_company2`, `demo_company3` / password: `Demo@123`
- Candidates: `demo_candidate1`, `demo_candidate2` / password: `Demo@123`
- Admin: `admin` / password: `Admin@123`

### 2) Full happy path (manual UI)

1. Register a Company
2. Post a New Job
3. Register a Candidate
4. Browse Jobs and Apply
5. Login as Company → View Applicants → Approve

### 3) Role-based access test

- Login as Candidate
- Try visiting `/company/dashboard` and `/admin/report/candidates`
- Expected: redirected to **Access Denied**

### 4) Automated API smoke test (PowerShell)

After restarting backend + frontend, you can run:

```powershell
cd D:\CAREERPORTAL
powershell -ExecutionPolicy Bypass -File .\qa-smoke.ps1
```

