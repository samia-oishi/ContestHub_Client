import { Outlet } from 'react-router'
import { Footer } from '../shared/Footer'
import { Navbar } from '../shared/Navbar'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
