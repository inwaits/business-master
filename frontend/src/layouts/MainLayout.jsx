import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Business Master. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

