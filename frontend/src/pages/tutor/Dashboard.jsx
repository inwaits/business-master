import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorProfile, getTutorSessions, getTutorEarnings, getMatchNotifications } from '../../redux/slices/tutorSlice'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Calendar, DollarSign, Users, Bell } from 'lucide-react'

export default function TutorDashboard() {
  const dispatch = useDispatch()
  const { profile, sessions, earnings, matchNotifications } = useSelector((state) => state.tutor)

  useEffect(() => {
    dispatch(getTutorProfile())
    dispatch(getTutorSessions({}))
    dispatch(getTutorEarnings())
    dispatch(getMatchNotifications())
  }, [dispatch])

  const stats = [
    { label: 'Upcoming Classes', value: sessions?.filter(s => s.status === 'SCHEDULED').length || 0, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Completed', value: profile?.completedClasses || 0, icon: Users, color: 'bg-green-500' },
    { label: 'Available Balance', value: `Rs. ${earnings?.availableBalance?.toLocaleString() || 0}`, icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Rating', value: profile?.averageRating?.toFixed(1) || '0.0', icon: Users, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.fullName}!</h1>
        <p className="text-gray-600">Here's what's happening with your classes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Match Notifications */}
      {matchNotifications && matchNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                New Student Requests ({matchNotifications.length})
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {matchNotifications.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">{request.subject?.name} - {request.grade?.name}</p>
                    <p className="text-sm text-gray-600">Location: {request.preferredCity}</p>
                  </div>
                  <Button size="sm">Accept</Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
        </CardHeader>
        <CardBody>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{session.subject?.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.sessionDate).toLocaleDateString()} at {session.startTime}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No upcoming sessions</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

