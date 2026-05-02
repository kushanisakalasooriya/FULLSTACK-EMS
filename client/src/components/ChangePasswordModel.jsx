import { Loader2Icon, LockIcon, X } from 'lucide-react'
import React from 'react'
import api from '../api/axios'

const ChangePasswordModel = ({open, onClose}) => {

    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState({type: "", text: ""})
    
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true);
        setMessage({type: "", text: ""})
        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword");
        const newPassword = formData.get("newPassword");

        try {
            const {data} = await api.post("/auth/change-password", {currentPassword, newPassword});
            if(!data.success) {
                throw new Error(data.message || "Failed to change password. Please try again.");
            }
            setMessage({type: "success", text: data.message || "Password changed successfully."});
            e.target.reset();    
        } catch (error) {
            setMessage({type: "error", text: error.response?.data?.error || error.message || "Failed to change password. Please try again."});
        } finally {
            setLoading(false);
        }
    }

    if(!open) {
        return null
    }

  return (
    <div onClick={onClose} className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'/>
        <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in' onClick={(e) => e.stopPropagation()}> 
            <div className='flex items-center justify-between p-6 pb-6'>
                <h2 className='text-lg font-medium text-slate-900 flex items-center gap-2'>
                    <LockIcon className='w-5 h-5 text-slate-400'/> 
                    Change Password
                </h2>
                <button className='p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-500' onClick={onClose}>
                    <X className='w-5 h-5'/>
                </button>
            </div>

            <form className='p-6 space-y-5' onSubmit={handleSubmit}>
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-rose-50 border-rose-200 text-rose-700"} flex items-start gap-3`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}/>
                        {message.text}
                    </div>
                )}
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        Current Password
                    </label>
                    <input
                        required
                        type="password"
                        name="currentPassword"
                        className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none py-2 px-3 rounded-lg"
                        placeholder="Enter your current password"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                    </label>
                    <input
                        required
                        type="password"
                        name="newPassword"
                        className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none py-2 px-3 rounded-lg"
                        placeholder="Enter your new password"
                    />
                </div>
                <div className='flex gap-3 pt-2'>
                    <button type='button' onClick={onClose} className='btn-secondary flex-1'>
                        cancel
                    </button>
                    <button type='Submit' disabled={loading} className='btn-primary flex-1 flex justify-center items0center gap-2'>
                        {loading && <Loader2Icon className='w-4 h-4 animate-spin'/>}
                        update password
                     </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ChangePasswordModel