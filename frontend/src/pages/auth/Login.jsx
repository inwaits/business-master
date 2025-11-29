import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../redux/slices/authSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { isLoading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(formData))
    
    if (!result.error) {
      const role = result.payload.role.toLowerCase()
      navigate(`/${role}/dashboard`)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-600 mb-6">Login to your account</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
        >
          Login
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register/parent" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up as Parent
          </Link>
          {' or '}
          <Link to="/register/tutor" className="text-primary-600 hover:text-primary-700 font-medium">
            Become a Tutor
          </Link>
        </p>
      </div>
    </div>
  )
}

