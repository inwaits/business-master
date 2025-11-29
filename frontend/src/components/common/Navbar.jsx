import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { logoutUser } from '../../redux/slices/authSlice'

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { unreadCount } = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                Business Master
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.email}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register/tutor"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Become a Tutor
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

