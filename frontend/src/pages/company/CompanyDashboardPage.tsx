import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

type Job = {
  id: number
  title: string
  location: string
  postedAt: string
  applicationCount: number
}

export function CompanyDashboardPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([api.get('/company/profile'), api.get('/company/jobs')])
      .then(([p, j]) => {
        setProfile(p.data)
        setJobs(j.data)
      })
      .catch((e) => {
        console.error('Company dashboard load error', e)
        setError(e?.response?.data?.message ?? 'Failed to load dashboard')
      })
  }, [])

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-4">
        <div className="text-xl font-semibold text-slate-800">Company Dashboard</div>
        <Link to="/company/post-job">
          <Button>+ Post New Job</Button>
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6">
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

        <Card>
          <div className="px-5 py-3 font-semibold text-slate-800">Your Posted Jobs</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Location</th>
                  <th className="text-left px-4 py-2">Posted On</th>
                  <th className="text-left px-4 py-2">Applications</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="border-t border-slate-200">
                    <td className="px-4 py-2">{j.title}</td>
                    <td className="px-4 py-2">{j.location}</td>
                    <td className="px-4 py-2">{new Date(j.postedAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <Link to={`/company/jobs/${j.id}/applicants`}>
                        <Button variant="secondary" className="px-3 py-1 text-xs">
                          View{typeof j.applicationCount === 'number' ? ` (${j.applicationCount})` : ''}
                        </Button>
                      </Link>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button variant="secondary" className="px-3 py-1 text-xs" disabled>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-1 text-xs"
                        onClick={async () => {
                          await api.delete(`/company/jobs/${j.id}`)
                          setJobs((prev) => prev.filter((x) => x.id !== j.id))
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                      No jobs posted yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  )
}

