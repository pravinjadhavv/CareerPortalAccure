import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label, Textarea, SectionTitle } from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export function RegisterCandidatePage() {
  const nav = useNavigate()
  const auth = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    mobile: '',
    status: 'fresher',
    gender: 'MALE',
    dob: '',
    education: '',
    workExp: '1 Year',
    skills: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader title="Register as Candidate" />
            <CardBody>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  try {
                    const payload = {
                      ...form,
                      gender: form.gender || null,
                      dob: form.dob ? form.dob : null,
                    }
                    const res = await api.post('/auth/register/candidate', payload)
                    const { token, role, userId } = res.data as { token: string; role: any; userId: number }
                    auth.login(token, role, userId)
                    if (resume || photo) {
                      const fd = new FormData()
                      if (resume) fd.append('resume', resume)
                      if (photo) fd.append('photo', photo)
                      await api.post('/candidate/profile/attachments', fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      })
                    }
                    nav('/candidate/profile')
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
                  <div>
                    <Label>Name*</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Mobile*</Label>
                    <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                  </div>
                  <div>
                    <Label>Status*</Label>
                    <Input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>DOB</Label>
                    <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                  </div>
                  <div>
                    <Label>Work exp</Label>
                    <Input value={form.workExp} onChange={(e) => setForm({ ...form, workExp: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Education</Label>
                    <Textarea
                      rows={4}
                      value={form.education}
                      onChange={(e) => setForm({ ...form, education: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Skills</Label>
                    <Textarea
                      rows={4}
                      value={form.skills}
                      onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <SectionTitle title="Attachments" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Resume</Label>
                      <Input type="file" onChange={(e) => setResume(e.target.files?.[0] ?? null)} />
                    </div>
                    <div>
                      <Label>Photo</Label>
                      <Input type="file" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                    </div>
                  </div>
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

