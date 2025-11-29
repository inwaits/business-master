import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getParentProfile } from '../../redux/slices/parentSlice'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

export default function ParentProfile() {
  const dispatch = useDispatch()
  const { profile, isLoading } = useSelector((state) => state.parent)

  useEffect(() => {
    dispatch(getParentProfile())
  }, [dispatch])

  if (isLoading || !profile) {
    return <Loader fullScreen />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
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
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{profile.address}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Students</h2>
            <Button variant="outline" size="sm">Add Student</Button>
          </div>
        </CardHeader>
        <CardBody>
          {profile.students && profile.students.length > 0 ? (
            <div className="space-y-3">
              {profile.students.map((student) => (
                <div key={student.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{student.fullName}</h3>
                      <p className="text-sm text-gray-600">{student.grade?.name}</p>
                      <p className="text-sm text-gray-600">{student.school || 'No school specified'}</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No students added yet</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

