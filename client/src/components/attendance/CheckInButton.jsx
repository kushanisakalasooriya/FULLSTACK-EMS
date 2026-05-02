import { Loader2Icon, LogInIcon, LogOutIcon } from 'lucide-react';
import React, { useState } from 'react'
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CheckInButton = ({todayRecord, onAction}) => {
    const [loading, setLoading ] = useState(false);

    const handleAttendance = async () => {
        setLoading(true);
        try {
            await api.post("/attendance");
            await onAction?.();
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || "Failed to update attendance. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if(todayRecord?.checkOut) {
        return (
            <div className='flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200'>
                <h3 className='text-lg font-bold text-slate-900'>Work Day Completed</h3>
                <p className='text-slate-500 text-sm mt-1'>See you tomorrow!</p>
            </div>
        )
    }

    const isCheckedIn = !!todayRecord?.checkIn;

  return (
    <div className='absolute bottom-4 right-4 flex flex-col z-10'>
        <button onClick={handleAttendance} disabled={loading} className={`w-full max-w-xs flex justify-between items-center gap-8 p-4 rounded-xl bg-linear-to-br text-white ${isCheckedIn ? "from-slate-700 to-indigo-700 hover:from-slate-800 hover:to-indigo-800" : "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"} transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed`}>
            {loading ? <Loader2Icon className='w-7 h-7 animate-spin' /> : isCheckedIn ? <LogOutIcon className='w-7 h-7'/> : <LogInIcon className='w-7 h-7'/>}
            <div className='relative flex flex-col item-center text-center'>
                <h2 className='text-lg font-medium mb-1'>{loading ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}</h2>
                <p className='opacity-80 text-sm'>{isCheckedIn ? "Click to end your shift" : "Click to start your shift"}</p>
            </div>
        </button>
    </div>
  )
}

export default CheckInButton