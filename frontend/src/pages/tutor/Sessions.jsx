import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorSessions } from '../../redux/slices/tutorSlice'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function TutorSessions() {
  const dispatch = useDispatch()
  const { sessions } = useSelector((state) => state.tutor)

  useEffect(() => {
    dispatch(getTutorSessions({}))
  }, [dispatch])

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">My Sessions</h2>
        </CardHeader>
        <CardBody>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{session.subject?.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Student: {session.student?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(session.sessionDate).toLocaleDateString()} at {session.startTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {session.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {session.status === 'SCHEDULED' && (
                        <>
                          <Button size="sm" variant="outline">Mark Attendance</Button>
                          <Button size="sm">Submit Report</Button>
                        </>
                      )}
                      {session.status === 'COMPLETED' && (
                        <Button size="sm" variant="outline">View Report</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No sessions found</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

