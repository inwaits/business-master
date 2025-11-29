import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register } from '../../redux/slices/authSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

export default function RegisterParent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PARENT',
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    province: '',
    students: [{
      fullName: '',
      gradeId: '',
      school: '',
    }],
  })
  const { isLoading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    const result = await dispatch(register(formData))
    if (!result.error) {
      navigate('/parent/dashboard')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as Parent</h2>
      <p className="text-gray-600 mb-6">Create your account to find tutors</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Input
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <Input
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <Input
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <Input
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <Input
          name="province"
          label="Province"
          value={formData.province}
          onChange={handleChange}
          required
        />

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Student Information</h3>
          <Input
            name="studentName"
            label="Student Full Name"
            value={formData.students[0].fullName}
            onChange={(e) => setFormData({
              ...formData,
              students: [{ ...formData.students[0], fullName: e.target.value }]
            })}
            required
          />
        </div>

        <Button type="submit" fullWidth loading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  )
}

