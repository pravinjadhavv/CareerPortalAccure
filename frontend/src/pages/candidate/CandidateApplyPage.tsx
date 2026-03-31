import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label } from '../../components/ui'
import { api } from '../../lib/api'

export function CandidateApplyPage() {
  const { jobId } = useParams()
  const location = useLocation()
  const nav = useNavigate()
  const [resume, setResume] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card>
            <div className="bg-[#0a3c66] text-white rounded-t-xl">
              <CardHeader
                title={`Apply to "${(location.state as { jobTitle?: string } | null)?.jobTitle ?? jobId ?? ''}"`}
                subtitle="Resume: Choose File | No file chosen"
              />
            </div>
            <CardBody>
              {message ? (
                <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}
              {error ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="space-y-4">
                <div>
                  <Label>Resume</Label>
                  <Input type="file" onChange={(e) => setResume(e.target.files?.[0] ?? null)} />
                </div>
                <Button
                  variant="success"
                  className="w-full"
                  onClick={async () => {
                    setMessage(null)
                    setError(null)
                    try {
                      const res = resume
                        ? await api.post(
                            `/jobs/${jobId}/apply`,
                            (() => {
                              const fd = new FormData()
                              fd.append('resume', resume)
                              return fd
                            })(),
                            { headers: { 'Content-Type': 'multipart/form-data' } },
                          )
                        : await api.post(`/jobs/${jobId}/apply`, {}, { headers: { 'Content-Type': 'application/json' } })
                      setMessage(res.data?.message ?? 'Application submitted successfully')
                      setTimeout(() => nav('/jobs'), 800)
                    } catch (e: any) {
                      setError(e?.response?.data?.message ?? 'Apply failed')
                    }
                  }}
                >
                  Submit Application
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

