import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label, Textarea } from '../../components/ui'
import { api } from '../../lib/api'

type CompanyProfile = {
  id: number
  companyName: string
  industry: string | null
  companySize: string | null
  headquarters: string | null
  companyType: string | null
  founded: string | null
  specialties: string | null
  address: string | null
  companyPhone: string | null
}

export function CompanyProfileEditPage() {
  const nav = useNavigate()
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/company/profile')
      .then((r) => setProfile(r.data))
      .catch((e) => {
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
            <CardHeader title="Edit Company Profile" />
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

              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setMessage(null)
                  setError(null)
                  try {
                    await api.put('/company/profile', {
                      companyName: profile.companyName,
                      industry: profile.industry,
                      companySize: profile.companySize,
                      headquarters: profile.headquarters,
                      companyType: profile.companyType,
                      founded: profile.founded,
                      specialties: profile.specialties,
                      address: profile.address,
                      companyPhone: profile.companyPhone,
                    })
                    nav('/company/profile', { state: { message: 'Profile updated successfully' } })
                  } catch (e: any) {
                    setError(e?.response?.data?.message ?? 'Save failed')
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company name*</Label>
                    <Input
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Input
                      value={profile.industry ?? ''}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label>Company size</Label>
                    <Input
                      value={profile.companySize ?? ''}
                      onChange={(e) => setProfile({ ...profile, companySize: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label>Headquarters</Label>
                    <Input
                      value={profile.headquarters ?? ''}
                      onChange={(e) => setProfile({ ...profile, headquarters: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label>Company type</Label>
                    <Input
                      value={profile.companyType ?? ''}
                      onChange={(e) => setProfile({ ...profile, companyType: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label>Founded</Label>
                    <Input
                      value={profile.founded ?? ''}
                      onChange={(e) => setProfile({ ...profile, founded: e.target.value || null })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Specialties</Label>
                    <Textarea
                      rows={4}
                      value={profile.specialties ?? ''}
                      onChange={(e) => setProfile({ ...profile, specialties: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      rows={4}
                      value={profile.address ?? ''}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value || null })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Company phone</Label>
                  <Input
                    value={profile.companyPhone ?? ''}
                    onChange={(e) => setProfile({ ...profile, companyPhone: e.target.value || null })}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      nav('/company/profile')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

