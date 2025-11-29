import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getParentDashboard } from '../../redux/slices/parentSlice'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Calendar, Users, DollarSign, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ParentDashboard() {
  const dispatch = useDispatch()
  const { dashboard, isLoading } = useSelector((state) => state.parent)

  useEffect(() => {
    dispatch(getParentDashboard())
  }, [dispatch])

  if (isLoading || !dashboard) {
    return <div>Loading...</div>
  }

  const stats = [
    { label: 'Total Sessions', value: dashboard.statistics?.totalSessions || 0, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Completed', value: dashboard.statistics?.completedSessions || 0, icon: Users, color: 'bg-green-500' },
    { label: 'Total Spent', value: `Rs. ${dashboard.statistics?.totalSpent?.toLocaleString() || 0}`, icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Students', value: dashboard.parent?.students?.length || 0, icon: BookOpen, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {dashboard.parent?.fullName}!</h1>
          <p className="text-gray-600">Manage your children's education</p>
        </div>
        <Link to="/parent/find-tutor">
          <Button>Find a Tutor</Button>
        </Link>
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

      {/* Students */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">My Students</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboard.parent?.students?.map((student) => (
              <div key={student.id} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold">{student.fullName}</h3>
                <p className="text-sm text-gray-600">{student.grade?.name}</p>
                <p className="text-sm text-gray-600">{student.school || 'No school specified'}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
        </CardHeader>
        <CardBody>
          {dashboard.upcomingSessions && dashboard.upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {dashboard.upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{session.subject?.name}</h3>
                      <p className="text-sm text-gray-600">Tutor: {session.tutor?.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.sessionDate).toLocaleDateString()} at {session.startTime}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No upcoming sessions</p>
          )}
        </CardBody>
      </Card>

      {/* Pending Payments */}
      {dashboard.pendingPayments && dashboard.pendingPayments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pending Payments</h2>
              <Button size="sm">Pay All</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {dashboard.pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.subject?.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.sessionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs. {payment.totalAmount?.toLocaleString()}</p>
                    <Button size="sm">Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

