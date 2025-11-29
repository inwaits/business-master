import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorEarnings } from '../../redux/slices/tutorSlice'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { DollarSign, TrendingUp, Clock } from 'lucide-react'

export default function TutorEarnings() {
  const dispatch = useDispatch()
  const { earnings } = useSelector((state) => state.tutor)

  useEffect(() => {
    dispatch(getTutorEarnings())
  }, [dispatch])

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                Rs. {earnings?.availableBalance?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <Button className="mt-4" fullWidth>Request Payout</Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Balance</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                Rs. {earnings?.pendingBalance?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                Rs. {earnings?.totalEarnings?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Payments</h2>
        </CardHeader>
        <CardBody>
          {earnings?.recentPayments && earnings.recentPayments.length > 0 ? (
            <div className="space-y-3">
              {earnings.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Session Payment</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.sessionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      + Rs. {payment.tutorAmount?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{payment.payment?.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No payment history</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

