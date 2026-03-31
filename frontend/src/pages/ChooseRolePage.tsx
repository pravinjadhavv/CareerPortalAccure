import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { Button, Card, CardBody, CardHeader } from '../components/ui'

export function ChooseRolePage() {
  return (
    <PageShell>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader title="Choose Your Role" />
            <CardBody>
              <div className="flex flex-col gap-3">
                <Link to="/register/candidate">
                  <Button className="w-full">Register as Candidate</Button>
                </Link>
                <Link to="/register/company">
                  <Button variant="success" className="w-full">
                    Register as Company
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

