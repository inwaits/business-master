import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorProfile } from '../../redux/slices/tutorSlice'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

export default function TutorProfile() {
  const dispatch = useDispatch()
  const { profile, isLoading } = useSelector((state) => state.tutor)

  useEffect(() => {
    dispatch(getTutorProfile())
  }, [dispatch])

  if (isLoading || !profile) {
    return <Loader fullScreen />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">{profile.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{profile.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="font-medium">{profile.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">University</p>
              <p className="font-medium">{profile.university}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Degree</p>
              <p className="font-medium">{profile.degree}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Teaching Subjects</h2>
        </CardHeader>
        <CardBody>
          {profile.subjects && profile.subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.subjects.map((sub) => (
                <div key={sub.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium">{sub.subject?.name}</p>
                  <p className="text-sm text-gray-600">{sub.grade?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No subjects added yet</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Performance</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold">{profile.totalClasses || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{profile.completedClasses || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold">{profile.averageRating?.toFixed(1) || '0.0'}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

