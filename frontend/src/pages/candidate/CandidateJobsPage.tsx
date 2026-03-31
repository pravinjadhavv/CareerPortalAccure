import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'
import { Button, Card } from '../../components/ui'
import { api } from '../../lib/api'

type Job = {
  id: number
  title: string
  description: string
  location: string
  salary: number | null
  postedAt: string
  companyName: string
  applicationCount: number
}

export function CandidateJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/jobs')
      .then((r) => setJobs(r.data))
      .catch((e) => setError(e?.response?.data?.message ?? 'Failed to load jobs'))
  }, [])

  return (
    <PageShell>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800">Available Job Openings</h2>
        <p className="mt-1 text-sm text-slate-600">
          Explore the latest opportunities and apply to positions that fit your skills.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobs.map((j) => (
          <Card key={j.id}>
            <div className="p-5">
              <div className="text-lg font-semibold text-slate-800">{j.title}</div>
              <div className="mt-1 text-xs text-slate-500">{j.companyName}</div>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <div>
                  <span className="font-medium">Location:</span> {j.location}
                </div>
                <div>
                  <span className="font-medium">Salary:</span> {j.salary ?? '—'}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium">Posted:</span> {new Date(j.postedAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link to={`/jobs/${j.id}/apply`} state={{ jobTitle: j.title }}>
                  <Button variant="secondary">Apply Now</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

