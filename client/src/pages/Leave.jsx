import React, { useCallback, useEffect, useState } from 'react'
import { dummyLeaveData } from '../assets/assets';
import Loading from '../components/Loading';
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react';
import LeaveHistory from '../components/leave/leaveHistory';
import ApplyLeveModel from '../components/leave/ApplyLeveModel';

const Leave = () => {
  const  [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const isAdmin = false;

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, [])

  useEffect(()=>{
    fetchLeaves()
  }, [fetchLeaves])

  if(loading) {
    return <Loading />
  }

  const approveLeaves = leaves.filter(leave => leave.status === "APPROVED");
  const sickleaves = approveLeaves.filter(leave => leave.type === "SICK").length;
  const casualLeaves = approveLeaves.filter(leave => leave.type === "CASUAL").length;
  const annualLeaves = approveLeaves.filter(leave => leave.type === "ANNUAL").length;

  const leaveStats = [
    { label: "Sick Leaves", value: sickleaves, icon: ThermometerIcon},
    { label: "Casual Leaves", value: casualLeaves, icon: UmbrellaIcon},
    { label: "Annual Leaves", value: annualLeaves, icon: PalmtreeIcon },
  ]

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Leave Management</h1>
          <p className='page-subtitle'>{isAdmin? "Manage leave requests and view leave balances.": "Manage your leave requests and view your leave balance."}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button onClick={()=> setShowModel(true)} className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'>
            <PlusIcon className='w-4 h-4'/> Apply for Leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8'>
          {leaveStats.map((s)=>(
            <div key={s.label} className='card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
              <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70'/>
              <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                <s.icon className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200" />
              </div>
              <div>
                <p className='text-sm text-slate-500'>{s.label}</p>
                <p className='text-2xl font-bold text-slate-900 tracking-tight'>{s.value} <span className='text-sm font-normal text-slate-400'>taken</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      <ApplyLeveModel open={showModel} onClose={()=> setShowModel(false)} onSuccess={fetchLeaves}/>
    </div>
  )
}

export default Leave