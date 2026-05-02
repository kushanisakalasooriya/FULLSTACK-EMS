import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Loading from "../components/Loading";
import api from "../api/axios";

function formatMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : "—";
}

const PrintPaySlip = () => {

  const {id} = useParams();
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    api.get(`/payslips/${id}`).then(res => {
      const payload = res.data?.result ?? res.data;
      setPayslip(payload && typeof payload === "object" ? payload : null);
    }).catch(error => {
      setPayslip(null);
    }).finally(() => {
      setLoading(false);
    })
  },[id])

  if(loading) {
    return <Loading/>
  }

  if(!payslip) {
    return (
      <p className="text-center py-12 text-slate-400">Payslip not found</p>
    )
  }

  let periodLabel = "—"
  if (payslip.year != null && payslip.month != null) {
    periodLabel = new Date(payslip.year, payslip.month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  } else if (payslip.date != null) {
    const d = new Date(payslip.date)
    if (!Number.isNaN(d.getTime())) {
      periodLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white animate-fade-in">
      <div className="text-center border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">PAYSLIP</h1>
        <p className="text-slate-500 text-sm mt-1">{periodLabel}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Employee Name</p>
          <p className="font-semibold text-slate-900">{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Position</p>
          <p className="font-semibold text-slate-900">{payslip.employee?.position}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</p>
          <p className="font-semibold text-slate-900">{payslip.employee?.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Month & year</p>
          <p className="font-semibold text-slate-900">{periodLabel}</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="py-3 px-4 text-left text-sm text-slate-500 uppercase">Description</th>
              <th className="py-3 px-4 text-right text-sm text-slate-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Basic Salary</td>
              <td className="py-3 px-4 text-right text-slate-700 font-medium">${formatMoney(payslip.basicSalary)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Allowances</td>
              <td className="py-3 px-4 text-right text-slate-700 font-medium">+${formatMoney(payslip.allowances)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Deductions</td>
              <td className="py-3 px-4 text-right text-slate-700 font-medium">-${formatMoney(payslip.deductions)}</td>
            </tr>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="py-3 px-4 text-slate-700">Net Salary</td>
              <td className="py-3 px-4 text-right text-slate-700 font-bold text-slate-900 text-lg">${formatMoney(payslip.netSalary)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md print:hidden" onClick={() => window.print()}>
          Print Payslip
        </button>
      </div>
    </div>
  )
}

export default PrintPaySlip