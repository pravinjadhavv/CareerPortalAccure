import { useEffect, useState } from 'react'
import { PageShell } from '../../components/PageShell'
import { Button, Card, Input, Label } from '../../components/ui'
import { api } from '../../lib/api'

type Row = {
  id: number
  companyName: string
  email: string
  phone: string | null
  industry: string | null
  headquarters: string | null
  companyType: string | null
  founded: string | null
  specialties: string | null
  createdAt: string
}

export function AdminCompanyReportPage() {
  const [filters, setFilters] = useState({ companyName: '', industry: '', createdAfter: '' })
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    const params: any = {}
    if (filters.companyName) params.companyName = filters.companyName
    if (filters.industry) params.industry = filters.industry
    if (filters.createdAfter) params.createdAfter = filters.createdAfter
    const r = await api.get('/admin/reports/companies', { params })
    setRows(r.data)
  }

  useEffect(() => {
    load().catch((e) => setError(e?.response?.data?.message ?? 'Failed to load report'))
  }, [])

  return (
    <PageShell>
      <div className="text-center">
        <div className="text-2xl font-semibold text-slate-800">Company Profiles Report</div>
      </div>

      <Card>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <Label>Company name</Label>
              <Input
                value={filters.companyName}
                onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
              />
            </div>
            <div>
              <Label>Industry</Label>
              <Input value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })} />
            </div>
            <div>
              <Label>Profile Created After</Label>
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
                    'Company',
                    'Email',
                    'Phone',
                    'Industry',
                    'Headquarters',
                    'Type',
                    'Founded',
                    'Specialties',
                    'Created',
                  ]
                  const lines = rows.map((r) =>
                    [
                      r.companyName,
                      r.email,
                      r.phone ?? '',
                      r.industry ?? '',
                      r.headquarters ?? '',
                      r.companyType ?? '',
                      r.founded ?? '',
                      r.specialties ?? '',
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
                  a.download = 'company-report.csv'
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
                  <th className="text-left px-3 py-2">Company</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Phone</th>
                  <th className="text-left px-3 py-2">Industry</th>
                  <th className="text-left px-3 py-2">Headquarters</th>
                  <th className="text-left px-3 py-2">Type</th>
                  <th className="text-left px-3 py-2">Founded</th>
                  <th className="text-left px-3 py-2">Specialties</th>
                  <th className="text-left px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200 bg-white/70">
                    <td className="px-3 py-2">{r.companyName}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.phone ?? '—'}</td>
                    <td className="px-3 py-2">{r.industry ?? '—'}</td>
                    <td className="px-3 py-2">{r.headquarters ?? '—'}</td>
                    <td className="px-3 py-2">{r.companyType ?? '—'}</td>
                    <td className="px-3 py-2">{r.founded ?? '—'}</td>
                    <td className="px-3 py-2">{r.specialties ?? '—'}</td>
                    <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-slate-500" colSpan={9}>
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

