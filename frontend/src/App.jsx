import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'

import AdminDashboard from './pages/admin/Dashboard'
import AdminPatients from './pages/admin/Patients'
import AdminDoctors from './pages/admin/Doctors'
import AdminAppointments from './pages/admin/Appointments'

import PatientDashboard from './pages/patient/Dashboard'
import PatientAppointments from './pages/patient/Appointments'
import PatientHistory from './pages/patient/History'
import PatientProfile from './pages/patient/Profile'

import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorSchedule from './pages/doctor/Schedule'
import DoctorPatients from './pages/doctor/Patients'

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

const RoleRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.role === 'ADMIN') return <Navigate to="/admin" />
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" />
  if (user.role === 'PATIENT') return <Navigate to="/patient" />
  return <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/go" element={<RoleRedirect />} />

      {/* Админ */}
      <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><Layout role="ADMIN" /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      {/* Пациент */}
      <Route path="/patient" element={<PrivateRoute roles={['PATIENT']}><Layout role="PATIENT" /></PrivateRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="history" element={<PatientHistory />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>

      {/* Доктор */}
      <Route path="/doctor" element={<PrivateRoute roles={['DOCTOR']}><Layout role="DOCTOR" /></PrivateRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="patients" element={<DoctorPatients />} />
      </Route>
    </Routes>
  )
}