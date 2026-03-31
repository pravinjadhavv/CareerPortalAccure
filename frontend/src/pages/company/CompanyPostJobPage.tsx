import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label, Textarea } from '../../components/ui'
import { api } from '../../lib/api'

export function CompanyPostJobPage() {
  const nav = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', location: '', salary: '' })
  const [error, setError] = useState<string | null>(null)

  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          <Card>
            <div className="bg-sky-600 text-white rounded-t-xl">
              <CardHeader title="Post a New Job" />
            </div>
            <CardBody>
              {error ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  try {
                    await api.post('/company/jobs', {
                      title: form.title,
                      description: form.description,
                      location: form.location,
                      salary: form.salary ? Number(form.salary) : null,
                    })
                    nav('/company/dashboard')
                  } catch (e: any) {
                    setError(e?.response?.data?.message ?? 'Failed to post job')
                  }
                }}
              >
                <div>
                  <Label>Title*</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <Label>Description*</Label>
                  <Textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Location*</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <Label>Salary</Label>
                  <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                </div>
                <Button variant="success" className="w-full">
                  Post Job
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

