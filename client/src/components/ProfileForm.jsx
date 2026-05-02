import { Loader2, Save, User } from 'lucide-react'
import React, { useState } from 'react'

const ProfileForm = ({initialData, onSuccess}) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

  return (
    <form onSubmit={handleSubmit} className='card p-5 sm:p-6 mb-6'>
      <h2 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2'>
         <User className='w-5 h-5 text-slate-600' /> Profile Information
      </h2>

      {error && (
        <div className='bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-3'>
            <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0'/>
            {error}
        </div>
      )}
      {message && (
        <div className='bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-3'>
            <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0'/>
            {message}
        </div>
      )}

      <div className='space-y-5'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
                <label htmlFor="" className='block text-sm font-medium text-slate-700 mb-2'>Name</label>
                <input type="text" disabled value={`${initialData.firstName} ${initialData.lastName}`} className='bg-slate-50 text-slate-400 cursor-not-allowd'/>
            </div>
            <div>
                <label htmlFor="" className='block text-sm font-medium text-slate-700 mb-2'>Email</label>
                <input type="email" disabled value={initialData.email} className='bg-slate-50 text-slate-400 cursor-not-allowd'/>
            </div>
            <div className='sm:col-span-2'>
                <label htmlFor="" className='block text-sm font-medium text-slate-700 mb-2'>Position</label>
                <input type="text" disabled value={initialData.position} className='bg-slate-50 text-slate-400 cursor-not-allowd'/>
            </div>
            <div className='sm:col-span-2'>
                <label htmlFor="" className='block text-sm font-medium text-slate-700 mb-2'>Bio</label>
                <textarea name="bio" id="" disabled={initialData.isDeleted} defaultValue={initialData.bio || ""} placeholder='Tell us about yourself...' rows={3} className={`resize-none ${initialData.isDeleted ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ""}`}/>
                <p className='text-xs text-slate-400 mt-1.5'>This will be display in your Profile</p>
            </div>
            {initialData.isDeleted ? (
                <div className='pt-2 sm:col-span-2'>
                    <div className='p-4 bg-rose-50 border border-rose-200 rounded-xl text-center'>
                        <p className='text-rose-600 font-medium tracking-tight'> Account Deactivated</p>
                        <p className='text-sm text-rose-500 mt-0.5'>You can no longer update your profile information.</p>
                    </div>
                </div>
            ) : (
                <div className='flex justify-end pt-2 sm:col-span-2'>
                    <button type='submit' className='btn btn-primary flex items-center gap-2 justify-center w-full sm:w-auto' disabled={loading}>
                        {loading ? <Loader2 className='w-4 h-4 animate-spin'/> : <Save className='w-4 h-4 '/>}
                        Save Changes
                    </button>
                </div>
            )}
        </div>
      </div>
    </form>
  )
}

export default ProfileForm