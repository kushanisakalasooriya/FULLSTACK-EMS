import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets"
import Loading from "../components/Loading"
import PayslipList from "../components/payslip/PayslipList"
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm"

const PaySlip = () => {

  const [payslip, setPaySlip] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = true;

  const fetchPaySlip = useCallback(()=>{
    setPaySlip(dummyPayslipData)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  },[])

  useEffect(()=> {
    fetchPaySlip()
  },[fetchPaySlip])

  useEffect(()=> {
    if(isAdmin) {
      setEmployees(dummyEmployeeData)
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