import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label, Textarea } from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export function RegisterCompanyPage() {
  const nav = useNavigate()
  const auth = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    companyName: '',
    industry: '',
    companySize: '',
    headquarters: '',
    companyType: '',
    founded: '',
    specialties: '',
    address: '',
    companyPhone: '',
  })
  const [error, setError] = useState<string | null>(null)

  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader title="Register as Company" />
            <CardBody>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  try {
                    const res = await api.post('/auth/register/company', form)
                    const { token, role, userId } = res.data as { token: string; role: any; userId: number }
                    auth.login(token, role, userId)
                    nav('/company/dashboard')
                  } catch (err: any) {
                    setError(err?.response?.data?.message ?? 'Registration failed')
                  }
                }}
              >
                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Username*</Label>
                    <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email*</Label>
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Password*</Label>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Password confirm*</Label>
                    <Input
                      type="password"
                      value={form.passwordConfirm}
                      onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company name*</Label>
                    <Input
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                  </div>
                  <div>
                    <Label>Company size</Label>
                    <Input
                      value={form.companySize}
                      onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Headquarters</Label>
                    <Input
                      value={form.headquarters}
                      onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company type</Label>
                    <Input
                      value={form.companyType}
                      onChange={(e) => setForm({ ...form, companyType: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Founded</Label>
                    <Input value={form.founded} onChange={(e) => setForm({ ...form, founded: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Specialties</Label>
                    <Textarea
                      rows={4}
                      value={form.specialties}
                      onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      rows={4}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Company phone</Label>
                  <Input
                    value={form.companyPhone}
                    onChange={(e) => setForm({ ...form, companyPhone: e.target.value })}
                  />
                </div>

                <Button className="w-full">Register</Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

