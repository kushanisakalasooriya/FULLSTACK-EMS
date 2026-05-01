

import { useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";

export const EmployeeForm = ({initialData, onSuccess, onCancel}) => {

  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;
  const handleSubmit = async (e) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in">

      {/* personal information */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="firstName" className="block text-slate-600 mb-2">First Name</label>
            <input type="text" id="firstName" name="firstName" required defaultValue={initialData?.firstName}/>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-slate-600 mb-2">Last Name</label>
            <input type="text" id="lastName" name="lastName" required defaultValue={initialData?.lastName}/>
          </div>
          <div>
            <label htmlFor="phone" className="block text-slate-600 mb-2">Phone Number</label>
            <input type="text" id="phone" name="phone" required defaultValue={initialData?.phone}/>
          </div>
          <div>
            <label htmlFor="joinDate" className="block text-slate-600 mb-2">Joined Date</label>
            <input type="date" id="joinDate" name="joinDate" required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : ""}/>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-slate-600 mb-2">Bio (Optional)</label>
            <input type="text" id="bio" name="bio" defaultValue={initialData?.bio} rows={3} className="resize-none placeholder:text-slate-400" placeholder="brief description..."/>
          </div>
        </div>
      </div>

      {/* job information */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Job Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="department" className="block text-slate-600 mb-2">Department</label>
            <select id="department" name="department" required defaultValue={initialData?.department || ""}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="position" className="block text-slate-600 mb-2">Position</label>
            <input type="text" id="position" name="position" required defaultValue={initialData?.position}/>
          </div>
          <div>
            <label htmlFor="basicSalary" className="block text-slate-600 mb-2">Basic Salary</label>
            <input type="number" id="basicSalary" name="basicSalary" min={0} step={0.01} required defaultValue={initialData?.basicSalary || 0}/>
          </div>
          <div>
            <label htmlFor="allowance" className="block text-slate-600 mb-2">Allowance</label>
            <input type="number" id="allowance" name="allowance" min={0} step={0.01} required defaultValue={initialData?.allowance || 0}/>
          </div>
          <div>
            <label htmlFor="deductions" className="block text-slate-600 mb-2">Deductions</label>
            <input type="number" id="deductions" name="deductions" min={0} step={0.01} required defaultValue={initialData?.deductions || 0}/>
          </div>
          {isEditing && (
            <div>
              <label htmlFor="isDeleted" className="block text-slate-600 mb-2">Status</label>
              <select id="isDeleted" name="isDeleted" required defaultValue={initialData?.isDeleted || "ACTIVE"}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Deleted</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* account setup */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-based font-medium text-slate-900 mb-6 pb-4 boder-b boder-slate-900">Account Setup</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-slate-600 mb-2">Work Email</label>
            <input type="email" id="email" name="email" required defaultValue={initialData?.email}/>
          </div>
          {!isEditing && (
            <div>
              <label htmlFor="password" className="block text-slate-600 mb-2"> Tempory Password</label>
              <input type="password" id="password" name="password" required/>
            </div>
          )}
          {isEditing && (
            <div>
              <label htmlFor="password" className="block text-slate-600 mb-2"> Change Password (Optional)</label>
              <input type="password" id="password" name="password" placeholder="leave blank to keep current"/>
            </div>
          )}
          <div>
            <label htmlFor="systemRole" className="block text-slate-600 mb-2"> System Role</label>
            <select id="systemRole" name="systemRole" required defaultValue={initialData?.systemRole || "EMPLOYEE"}>
              <option value="">Select Role</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={()=> (onCancel ? onCancel() : Navigate(-1))}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex items center justify-center">
            {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Update Employee" : "Create Employee"}
            
          </button>
      </div>

    </form>
  )
}
