import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets"
import Loading from "../components/Loading"
import PayslipList from "../components/payslip/PayslipList"
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"
import toast from "react-hot-toast"

const PaySlip = () => {
  const {user} = useAuth();
  const [payslip, setPaySlip] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === "ADMIN";

  const fetchPaySlip = useCallback(async ()=>{
      try {
        const res = await api.get("/payslips");
        setPaySlip(res.data.data || []);
      } catch (error) {
        toast.error("Error fetching payslip data:", error);
      } finally {
        setLoading(false);
      }
  },[])

  useEffect(()=> {
    fetchPaySlip()
  },[fetchPaySlip])

  useEffect(()=> {
    if(isAdmin) {
      api.get("/employees").then(res => {
        setEmployees(res.data.filter(emp => !emp.isDeleted) || []);
      }).catch(error => {
        toast.error("Error fetching employee data:", error);
      })
    }
  },[isAdmin])

  if(loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">PaySlip</h1>
          <p className="page-subtitle">{isAdmin ? "Generate and manage payslips" : "View your payslip"}</p>
        </div>
        {isAdmin && <GeneratePayslipForm employees={employees} onSuccess={fetchPaySlip}/>}
      </div>
      <PayslipList payslips={payslip} isAdmin={isAdmin}/>
    </div>
  )
}

export default PaySlip