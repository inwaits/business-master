import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import Login from './pages/auth/Login'
import RegisterTutor from './pages/auth/RegisterTutor'
import RegisterParent from './pages/auth/RegisterParent'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

// Tutor Pages
import TutorDashboard from './pages/tutor/Dashboard'
import TutorProfile from './pages/tutor/Profile'
import TutorSessions from './pages/tutor/Sessions'
import TutorEarnings from './pages/tutor/Earnings'

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard'
import ParentProfile from './pages/parent/Profile'
import FindTutor from './pages/parent/FindTutor'
import ParentSessions from './pages/parent/Sessions'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Auto-redirect authenticated users to their dashboard
  const getDashboardPath = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'TUTOR':
        return '/tutor/dashboard'
      case 'PARENT':
        return '/parent/dashboard'
      case 'ADMIN':
        return '/admin/dashboard'
      case 'SUPERVISOR':
        return '/supervisor/dashboard'
      default:
        return '/'
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <Login />
          } 
        />
        <Route 
          path="/register/tutor" 
          element={
            isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <RegisterTutor />
          } 
        />
        <Route 
          path="/register/parent" 
          element={
            isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <RegisterParent />
          } 
        />
      </Route>

      {/* Tutor Routes */}
      <Route
        path="/tutor/*"
        element={
          <ProtectedRoute allowedRoles={['TUTOR']}>
            <DashboardLayout role="tutor" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="profile" element={<TutorProfile />} />
        <Route path="sessions" element={<TutorSessions />} />
        <Route path="earnings" element={<TutorEarnings />} />
      </Route>

      {/* Parent Routes */}
      <Route
        path="/parent/*"
        element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <DashboardLayout role="parent" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="profile" element={<ParentProfile />} />
        <Route path="find-tutor" element={<FindTutor />} />
        <Route path="sessions" element={<ParentSessions />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

