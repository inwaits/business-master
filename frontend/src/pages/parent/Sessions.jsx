import Card, { CardHeader, CardBody } from '../../components/common/Card'

export default function ParentSessions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">My Sessions</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 text-center py-8">No sessions found</p>
        </CardBody>
      </Card>
    </div>
  )
}

