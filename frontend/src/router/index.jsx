import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ElderLayout from '../layouts/ElderLayout'
import DashboardHome from '../pages/dashboard/DashboardHome'
import ScheduleBuilder from '../pages/dashboard/ScheduleBuilder'
import ActivityFeed from '../pages/dashboard/ActivityFeed'
import CheckIn from '../pages/elder/CheckIn'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'schedule', element: <ScheduleBuilder /> },
      { path: 'activity', element: <ActivityFeed /> }
    ]
  },
  {
    path: '/check-in',
    element: <ElderLayout />,
    children: [{ index: true, element: <CheckIn /> }]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
])
