import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import LoginLanding from "./pages/LoginLanding"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import PaySlip from "./pages/PaySlip"
import Settings from "./pages/Settings"
import PrintPaySlip from "./pages/PrintPaySlip"
import LoginForm from "./components/LoginForm"


const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />} />

        <Route path="/login/admin" element={<LoginForm role="admin" title="Admin Portal" subtitle="Sign in to manage the organization" />} />
        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Portal" subtitle="Sign in to access your employee dashboard" />} />



        <Route element={<Layout />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payslip" element={<PaySlip />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPaySlip />} />
        <Route path="*" element={<Navigate to="/dashboard" replace/>} />
      </Routes>
    </div>
  )
}

export default  App