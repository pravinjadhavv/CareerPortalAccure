import { useEffect, useState } from 'react'
import { PageShell } from '../../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label, SectionTitle, Textarea } from '../../components/ui'
import { api } from '../../lib/api'

type CandidateProfile = {
  id: number
  username: string
  email: string
  name: string
  mobile: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null
  dob: string | null
  status: string | null
  education: string | null
  workExp: string | null
  skills: string | null
  resumePath: string | null
  photoPath: string | null
}

export function CandidateProfileEditPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  useEffect(() => {
    api
      .get('/candidate/profile')
      .then((r) => setProfile(r.data))
      .catch((e) => {
        console.error('Candidate profile load error', e)
        setError(e?.response?.data?.message ?? 'Failed to load profile')
      })
  }, [])

  if (!profile) {
    return (
      <PageShell>
        <div className="text-center text-slate-600">{error ?? 'Loading...'}</div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader title="Update Your Profile" subtitle="Please fill out the information below carefully." />
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

              <div className="space-y-6">
                <div>
                  <SectionTitle title="Personal Details" />
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name*</Label>
                      <Input value={profile.name ?? ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Mobile*</Label>
                      <Input value={profile.mobile ?? ''} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <select
                        className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        value={profile.gender ?? ''}
                        onChange={(e) => setProfile({ ...profile, gender: (e.target.value || null) as any })}
                      >
                        <option value="">--</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label>DOB</Label>
                      <Input
                        type="date"
                        value={(profile.dob ?? '') as any}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value || null })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle title="Professional Info" />
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Education</Label>
                      <Textarea
                        rows={5}
                        value={profile.education ?? ''}
                        onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Work exp</Label>
                      <Textarea
                        rows={5}
                        value={profile.workExp ?? ''}
                        onChange={(e) => setProfile({ ...profile, workExp: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Skills</Label>
                      <Textarea
                        rows={5}
                        value={profile.skills ?? ''}
                        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle title="Attachments" />
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Resume</Label>
                      <div className="mt-1 text-xs text-slate-600">
                        Currently: {profile.resumePath ? <span className="underline">{profile.resumePath}</span> : '—'}
                      </div>
                      <Input type="file" onChange={(e) => setResume(e.target.files?.[0] ?? null)} />
                    </div>
                    <div>
                      <Label>Photo</Label>
                      <div className="mt-1 text-xs text-slate-600">
                        Currently: {profile.photoPath ? <span className="underline">{profile.photoPath}</span> : '—'}
                      </div>
                      <Input type="file" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setMessage(null)
                      setError(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      setMessage(null)
                      setError(null)
                      try {
                        await api.put('/candidate/profile', {
                          name: profile.name,
                          mobile: profile.mobile,
                          status: profile.status,
                          gender: profile.gender,
                          dob: profile.dob,
                          education: profile.education,
                          workExp: profile.workExp,
                          skills: profile.skills,
                        })
                        if (resume || photo) {
                          const fd = new FormData()
                          if (resume) fd.append('resume', resume)
                          if (photo) fd.append('photo', photo)
                          const r = await api.post('/candidate/profile/attachments', fd, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                          })
                          setProfile(r.data)
                        }
                        setMessage('Profile updated successfully')
                      } catch (e: any) {
                        setError(e?.response?.data?.message ?? 'Save failed')
                      }
                    }}
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

