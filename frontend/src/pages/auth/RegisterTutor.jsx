import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register } from '../../redux/slices/authSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

export default function RegisterTutor() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'TUTOR',
    fullName: '',
    nicPassport: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    province: '',
    university: '',
    degree: '',
    graduationYear: '',
    yearsOfExperience: '',
    bio: '',
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
      navigate('/tutor/dashboard')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Tutor</h2>
      <p className="text-gray-600 mb-6">Step {step} of 3</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
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
              name="nicPassport"
              label="NIC/Passport"
              value={formData.nicPassport}
              onChange={handleChange}
              required
            />
            <Button type="button" onClick={nextStep} fullWidth>
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="dateOfBirth"
              label="Date of Birth"
              value={formData.dateOfBirth}
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
            <div className="flex gap-2">
              <Button type="button" onClick={prevStep} variant="outline" fullWidth>
                Back
              </Button>
              <Button type="button" onClick={nextStep} fullWidth>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Input
              name="university"
              label="University"
              value={formData.university}
              onChange={handleChange}
              required
            />
            <Input
              name="degree"
              label="Degree"
              value={formData.degree}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="graduationYear"
              label="Graduation Year"
              value={formData.graduationYear}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="yearsOfExperience"
              label="Years of Experience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2">
              <Button type="button" onClick={prevStep} variant="outline" fullWidth>
                Back
              </Button>
              <Button type="submit" fullWidth loading={isLoading}>
                Register
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

