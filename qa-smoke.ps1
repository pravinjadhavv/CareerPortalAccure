$ErrorActionPreference='Stop'

function Invoke-JsonPost($url, $body, $token=$null) {
  $headers = @{'Content-Type'='application/json'}
  if ($token) { $headers['Authorization'] = "Bearer $token" }
  return Invoke-RestMethod -Method Post -Uri $url -Headers $headers -Body ($body | ConvertTo-Json -Depth 10)
}

function Invoke-JsonPut($url, $body, $token=$null) {
  $headers = @{'Content-Type'='application/json'}
  if ($token) { $headers['Authorization'] = "Bearer $token" }
  return Invoke-RestMethod -Method Put -Uri $url -Headers $headers -Body ($body | ConvertTo-Json -Depth 10)
}

function Invoke-Get($url, $token=$null) {
  $headers = @{}
  if ($token) { $headers['Authorization'] = "Bearer $token" }
  return Invoke-RestMethod -Method Get -Uri $url -Headers $headers
}

$base = 'http://localhost:8080/api'
$suffix = (Get-Random -Minimum 1000 -Maximum 9999)

Write-Host "QA: Register company (suffix $suffix)..."
$companyReg = Invoke-JsonPost "$base/auth/register/company" @{
  username = "qa_company_$suffix";
  email = "qa_company_$suffix@demo.local";
  password = 'Qa@12345';
  passwordConfirm = 'Qa@12345';
  companyName = "QA Corp $suffix";
  industry = 'IT industry';
  companySize = '10+ Employees';
  headquarters = 'Pune';
  companyType = 'IT';
  founded = '2001';
  specialties = 'Good in website design';
  address = 'Delhi';
  companyPhone = '8800145588';
}
$compToken = $companyReg.token

Write-Host 'QA: Post a new job as company...'
$newJob = Invoke-JsonPost "$base/company/jobs" @{ title='Analyst'; description='none'; location='pune'; salary=410000 } $compToken
Write-Host ("Posted job: id={0} title={1}" -f $newJob.id, $newJob.title)

Write-Host "QA: Register candidate..."
$candidateReg = Invoke-JsonPost "$base/auth/register/candidate" @{
  username = "qa_candidate_$suffix";
  email = "qa_candidate_$suffix@demo.local";
  password = 'Qa@12345';
  passwordConfirm = 'Qa@12345';
  name = 'nilu';
  mobile = '9999995522';
  status = 'fresher';
  gender = 'MALE';
  dob = '2025-06-09';
  education = 'BE';
  workExp = '1 Year';
  skills = 'Java Python';
}
$candToken = $candidateReg.token

Write-Host 'QA: Candidate tries to access company endpoint (should fail)...'
$blocked = $false
try { Invoke-Get "$base/company/jobs" $candToken | Out-Null } catch { $blocked = $true }
Write-Host "Blocked: $blocked"
if (-not $blocked) { throw "Expected access denied, but request succeeded" }

Write-Host 'QA: Candidate job list includes newly created job...'
$jobs = Invoke-Get "$base/jobs"
$ids = @($jobs | ForEach-Object { [string]$_.id })
$found = $ids -contains ([string]$newJob.id)
Write-Host "Jobs count: $($jobs.Count) Found: $found"
if (-not $found) { throw "Expected new job in list, not found" }

Write-Host 'QA: Candidate applies to job (JSON fallback)...'
# requires backend version that supports application/json apply
$applyRes = Invoke-JsonPost "$base/jobs/$($newJob.id)/apply" @{} $candToken
$appId = $applyRes.data.id
Write-Host "Applied appId: $appId"

Write-Host 'QA: Company views applicants...'
$applicants = Invoke-Get "$base/company/jobs/$($newJob.id)/applicants" $compToken
Write-Host "Applicants: $($applicants.Count)"
if ($applicants.Count -lt 1) { throw "Expected at least 1 applicant" }

Write-Host 'QA: Company approves application...'
$accepted = Invoke-JsonPut "$base/company/applications/$appId/status" @{ status='APPROVED' } $compToken
Write-Host "Status: $($accepted.status)"
if ($accepted.status -ne 'APPROVED') { throw "Expected APPROVED" }

Write-Host 'QA: Admin report smoke test...'
$adminAuth = Invoke-JsonPost "$base/auth/login" @{ identifier='admin'; password='Admin@123' }
$adminToken = $adminAuth.token
$cReport = Invoke-Get "$base/admin/reports/candidates?skill=Java" $adminToken
$coReport = Invoke-Get "$base/admin/reports/companies?industry=IT" $adminToken
Write-Host "Candidate report rows: $($cReport.Count) | Company report rows: $($coReport.Count)"

Write-Host 'QA: PASS'

