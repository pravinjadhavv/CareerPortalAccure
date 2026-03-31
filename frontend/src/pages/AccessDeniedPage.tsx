import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { Button, Card, CardBody, CardHeader } from '../components/ui'

export function AccessDeniedPage() {
  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader title="Access Denied" subtitle="You are not authorized to access this page." />
            <CardBody>
              <div className="flex justify-center">
                <Link to="/">
                  <Button variant="secondary">Go Back to Home</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

