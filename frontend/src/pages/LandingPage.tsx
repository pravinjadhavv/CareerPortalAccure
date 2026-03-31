import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { Button, Card, CardBody, CardHeader } from '../components/ui'

export function LandingPage() {
  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader
              title="Welcome to CareerPortal"
              subtitle="Discover top job opportunities and connect with employers that value your skills."
            />
            <CardBody>
              <div className="flex justify-center gap-3">
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/choose-role">
                  <Button variant="secondary">Register</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

