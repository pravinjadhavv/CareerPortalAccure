import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'
import { Button, Card } from '../../components/ui'
import { api } from '../../lib/api'

type Application = {
  id: number
  jobTitle: string
  candidateName: string
  candidateEmail: string
  resumePath: string | null
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED'
}

export function CompanyApplicantsPage() {
  const { jobId } = useParams()
  const [apps, setApps] = useState<Application[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get(`/company/jobs/${jobId}/applicants`)
      .then((r) => setApps(r.data))
      .catch((e) => setError(e?.response?.data?.message ?? 'Failed to load applicants'))
  }, [jobId])

  return (
    <PageShell>
      <div className="text-center">
        <div className="text-xl font-semibold text-slate-800">
          Applicants for &quot;{apps[0]?.jobTitle ?? jobId}&quot;
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((a) => (
          <Card key={a.id}>
            <div className="p-5">
              <div className="text-sm">
                <div className="font-semibold text-slate-800">{a.candidateName || 'Candidate'}</div>
                <div className="text-slate-600">{a.candidateEmail}</div>
              </div>
              <div className="mt-3 text-xs text-slate-600">
                <span className="font-medium">Resume:</span>{' '}
                {a.resumePath ? (
                  <Button
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={async () => {
                      try {
                        const res = await api.get(`/company/applications/${a.id}/resume`, {
                          responseType: 'blob',
                        })
                        const blob = new Blob([res.data])
                        const url = window.URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        const disposition = res.headers['content-disposition'] as string | undefined
                        let filename = 'resume'
                        if (disposition) {
                          const match = disposition.match(/filename="?([^"]+)"?/)
                          if (match?.[1]) filename = match[1]
                        }
                        link.href = url
                        link.download = filename
                        document.body.appendChild(link)
                        link.click()
                        link.remove()
                        window.URL.revokeObjectURL(url)
                      } catch {
                        // best-effort download; errors are silently ignored here
                      }
                    }}
                  >
                    Download Resume
                  </Button>
                ) : (
                  '—'
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Status:</span> {a.status}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={async () => {
                      const r = await api.put(`/company/applications/${a.id}/status`, { status: 'APPROVED' })
                      setApps((prev) => prev.map((x) => (x.id === a.id ? r.data : x)))
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    className="px-3 py-1 text-xs"
                    onClick={async () => {
                      const r = await api.put(`/company/applications/${a.id}/status`, { status: 'REJECTED' })
                      setApps((prev) => prev.map((x) => (x.id === a.id ? r.data : x)))
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

