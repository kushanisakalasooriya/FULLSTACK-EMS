import { Loader2, Plus, X } from 'lucide-react'
import React, { useState } from 'react'

const GeneratePayslipForm = ({employees, onSuccess}) => {

    const [isOpen, setIsOpen] = useState(false)
    const [loading, setIsLoading] = useState(false)

    if(!isOpen) {
        return (
            <button onClick={()=> setIsOpen(true)} className='btn-primary flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Generate Payslip
            </button>
        )
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
        <div className='card max-w-lg w-full p-6 animate-slide-up'>
            <div className='flex justify-between item-center mb-6'>
                <h3 className='text-lg font-bold text-slate-900'>Generate Payslip</h3>
                <button onClick={()=> setIsOpen(false)}>
                    <X size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                {/* select Employee */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Employee</label>
                    <select className='input-field' required>
                        <option value="">Select Employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* select month & year */}
                <div className='mb-4'>
                    <div className='flex gap-4'>
                        <div className='flex-1 min-w-0'>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Month</label>
                            <select className='input-field w-full' required>
                                <option value="">Month</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Year</label>
                            <input type="number" name='year' className='input-field w-full' placeholder='e.g. 2024' required defaultValue={new Date().getFullYear()}/>
                        </div>
                    </div>
                </div>

                {/* Basic Salary */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Basic Salary</label>
                    <input type="number" name='basicSalary' className='input-field' placeholder='Enter basic salary' required />
                </div>

                {/* Allowance * deductions */}
                <div className='grid grid-cols-2 gap-4'>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Allowance</label>
                        <input type="number" name='allowance' className='input-field' placeholder='Enter allowance' />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Deductions</label>
                        <input type="number" name='deductions' className='input-field' placeholder='Enter deductions' />
                    </div>
                </div>

                {/* buttons */}
                <div className='flex justify-end gap-3 pt-2'>
                    <button
                        type="button"
                        onClick={()=> setIsOpen(false)}
                        className='btn-secondary'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className='btn-primary flex items-center'
                    >
                        {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin'/>}
                        Generate Payslip
                    </button>
                </div>
            </form>

        </div>
    </div>
  )
}

export default GeneratePayslipForm