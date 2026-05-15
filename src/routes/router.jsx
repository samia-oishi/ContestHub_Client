import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App'
import { MainLayout } from '../components/layout/MainLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { RequireAuth } from '../components/shared/RequireAuth'
import { Home } from '../pages/home/Home'
import { AllContests } from '../pages/contests/AllContests'
import { ContestDetails } from '../pages/contests/ContestDetails'
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { DashboardHome } from '../pages/dashboard/DashboardHome'
import { PlaceholderPage } from '../pages/dashboard/PlaceholderPage'
import { Payment } from '../pages/payment/Payment'
import { Leaderboard } from '../pages/leaderboard/Leaderboard'
import { HowItWorks } from '../pages/static/HowItWorks'
import { SuccessStories } from '../pages/static/SuccessStories'
import { NotFound } from '../pages/error/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'all-contests', element: <AllContests /> },
          { path: 'leaderboard', element: <Leaderboard /> },
          { path: 'how-it-works', element: <HowItWorks /> },
          { path: 'success-stories', element: <SuccessStories /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          {
            path: 'contests/:id',
            element: (
              <RequireAuth>
                <ContestDetails />
              </RequireAuth>
            ),
          },
          {
            path: 'payment/:contestId',
            element: (
              <RequireAuth>
                <Payment />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'my-contests', element: <RequireAuth roles={['user']}><PlaceholderPage title="My Participated Contests" /></RequireAuth> },
          { path: 'winning-contests', element: <RequireAuth roles={['user']}><PlaceholderPage title="My Winning Contests" /></RequireAuth> },
          { path: 'profile', element: <RequireAuth roles={['user', 'creator', 'admin']}><PlaceholderPage title="My Profile" /></RequireAuth> },
          { path: 'add-contest', element: <RequireAuth roles={['creator']}><PlaceholderPage title="Add Contest" /></RequireAuth> },
          { path: 'my-created-contests', element: <RequireAuth roles={['creator']}><PlaceholderPage title="My Created Contests" /></RequireAuth> },
          { path: 'edit-contest/:id', element: <RequireAuth roles={['creator']}><PlaceholderPage title="Edit Contest" /></RequireAuth> },
          { path: 'submissions', element: <RequireAuth roles={['creator']}><PlaceholderPage title="Submitted Tasks" /></RequireAuth> },
          { path: 'manage-users', element: <RequireAuth roles={['admin']}><PlaceholderPage title="Manage Users" /></RequireAuth> },
          { path: 'manage-contests', element: <RequireAuth roles={['admin']}><PlaceholderPage title="Manage Contests" /></RequireAuth> },
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
