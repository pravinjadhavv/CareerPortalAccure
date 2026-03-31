import { useEffect, useState } from 'react'
import { PageShell } from '../../components/PageShell'
import { Button, Card, Input, Label } from '../../components/ui'
import { api } from '../../lib/api'

type Row = {
  id: number
  name: string
  email: string
  mobile: string
  gender: string | null
  education: string | null
  workExp: string | null
  skills: string | null
  createdAt: string
}

export function AdminCandidateReportPage() {
  const [filters, setFilters] = useState({ gender: '', education: '', skill: '', workExp: '', createdAfter: '' })
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    const params: any = {}
    if (filters.gender) params.gender = filters.gender
    if (filters.education) params.education = filters.education
    if (filters.skill) params.skill = filters.skill
    if (filters.workExp) params.workExp = filters.workExp
    if (filters.createdAfter) params.createdAfter = filters.createdAfter
    const r = await api.get('/admin/reports/candidates', { params })
    setRows(r.data)
  }

  useEffect(() => {
    load().catch((e) => setError(e?.response?.data?.message ?? 'Failed to load report'))
  }, [])

  return (
    <PageShell>
      <div className="text-center">
        <div className="text-2xl font-semibold text-slate-800">Candidate Report</div>
      </div>

      <Card>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
              <Label>Gender</Label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <option value="">All</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <Label>Education</Label>
              <Input value={filters.education} onChange={(e) => setFilters({ ...filters, education: e.target.value })} />
            </div>
            <div>
              <Label>Skill</Label>
              <Input value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
            </div>
            <div>
              <Label>Work exp</Label>
              <Input value={filters.workExp} onChange={(e) => setFilters({ ...filters, workExp: e.target.value })} />
            </div>
            <div>
              <Label>Created after</Label>
              <Input
                type="date"
                value={filters.createdAfter}
                onChange={(e) => setFilters({ ...filters, createdAfter: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => load().catch((e) => setError(e?.response?.data?.message ?? 'Failed'))}>Search</Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  const header = [
                    'Name',
                    'Email',
                    'Mobile',
                    'Gender',
                    'Education',
                    'Work exp',
                    'Skills',
                    'Created',
                  ]
                  const lines = rows.map((r) =>
                    [
                      r.name,
                      r.email,
                      r.mobile,
                      r.gender ?? '',
                      r.education ?? '',
                      r.workExp ?? '',
                      r.skills ?? '',
                      new Date(r.createdAt).toLocaleString(),
                    ]
                      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                      .join(','),
                  )
                  const csv = [header.join(','), ...lines].join('\r\n')
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'candidate-report.csv'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  window.URL.revokeObjectURL(url)
                }}
              >
                Export Excel
              </Button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Mobile</th>
                  <th className="text-left px-3 py-2">Gender</th>
                  <th className="text-left px-3 py-2">Education</th>
                  <th className="text-left px-3 py-2">Work exp</th>
                  <th className="text-left px-3 py-2">Skills</th>
                  <th className="text-left px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200 bg-white/70">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.mobile}</td>
                    <td className="px-3 py-2">{r.gender ?? '—'}</td>
                    <td className="px-3 py-2">{r.education ?? '—'}</td>
                    <td className="px-3 py-2">{r.workExp ?? '—'}</td>
                    <td className="px-3 py-2">{r.skills ?? '—'}</td>
                    <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-slate-500" colSpan={8}>
                      No results.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </PageShell>
  )
}

