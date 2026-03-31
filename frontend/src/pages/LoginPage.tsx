import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { Button, Card, CardBody, CardHeader, Input, Label } from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useState } from 'react'

export function LoginPage() {
  const nav = useNavigate()
  const auth = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader title="Welcome Back" subtitle="Login with your credentials below" />
            <CardBody>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  try {
                    const res = await api.post('/auth/login', { identifier, password })
                    const { token, role, userId } = res.data as { token: string; role: any; userId: number }
                    auth.login(token, role, userId)
                    if (role === 'CANDIDATE') nav('/jobs')
                    else if (role === 'COMPANY') nav('/company/dashboard')
                    else nav('/admin/report/candidates')
                  } catch (err: any) {
                    setError(err?.response?.data?.message ?? 'Login failed')
                  }
                }}
              >
                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
                <div>
                  <Label>Username or Email</Label>
                  <Input
                    placeholder="Enter your username or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" />
                    Remember me
                  </label>
                  <a className="text-sky-700 hover:underline" href="#">
                    Forgot password?
                  </a>
                </div>
                <Button className="w-full">Login</Button>
                <div className="text-center text-xs text-slate-600">
                  Don&apos;t have an account?{' '}
                  <Link className="text-sky-700 hover:underline" to="/choose-role">
                    Create Account
                  </Link>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

