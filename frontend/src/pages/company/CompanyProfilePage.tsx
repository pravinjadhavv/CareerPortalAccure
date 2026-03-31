import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'
import { Button, Card } from '../../components/ui'
import { api } from '../../lib/api'

type CompanyProfile = {
  id: number
  companyName: string
  email: string
  companyPhone: string | null
  industry: string | null
  address: string | null
}

export function CompanyProfilePage() {
  const location = useLocation()
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [message, setMessage] = useState<string | null>(
    (location.state as { message?: string } | null)?.message ?? null,
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/company/profile')
      .then((r) => setProfile(r.data))
      .catch((e) => {
        setError(e?.response?.data?.message ?? 'Failed to load profile')
      })
  }, [])

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-4">
        <div className="text-xl font-semibold text-slate-800">Company Profile</div>
        <div className="flex gap-2">
          <Link to="/company/post-job">
            <Button>Post New Job</Button>
          </Link>
          <Link to="/company/profile/edit">
            <Button variant="secondary">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        <Card>
          <div className="bg-sky-600 text-white rounded-t-xl px-5 py-3 font-semibold">Company Profile</div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
            <div>
              <span className="font-medium">Company Name:</span> {profile?.companyName ?? '—'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {(profile as any)?.email ?? '—'}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {profile?.companyPhone ?? '—'}
            </div>
            <div>
              <span className="font-medium">Industry:</span> {profile?.industry ?? '—'}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Address:</span> {profile?.address ?? '—'}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Link to="/company/dashboard">
          <Button variant="secondary">Go to Company Dashboard</Button>
        </Link>
      </div>
    </PageShell>
  )
}

