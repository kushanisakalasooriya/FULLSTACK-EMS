import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

export const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;
  const employeeId = initialData?.id || initialData?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const raw = Object.fromEntries(formData.entries());

      if (isEditing && !raw.password) {
        delete raw.password;
      }

      const payload = {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        phone: raw.phone,
        position: raw.position,
        department: raw.department,
        basicSalary: Number(raw.basicSalary) || 0,
        allowances: Number(raw.allowance ?? raw.allowances) || 0,
        deductions: Number(raw.deductions) || 0,
        joinDate: raw.joinDate,
        bio: raw.bio || "",
        role: raw.systemRole || "EMPLOYEE",
      };

      if (isEditing) {
        if (raw.employmentStatus) {
          payload.employementStatus = raw.employmentStatus;
        }
        if (raw.password) {
          payload.password = raw.password;
        }
        await api.put(`/employees/${employeeId}`, payload);
      } else {
        payload.password = raw.password;
        await api.post("/employees", payload);
      }

      toast.success(isEditing ? "Employee updated" : "Employee created");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/employees");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} employee. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in">
      {/* personal information */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="firstName" className="block text-slate-600 mb-2">First Name</label>
            <input type="text" id="firstName" name="firstName" required defaultValue={initialData?.firstName} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-slate-600 mb-2">Last Name</label>
            <input type="text" id="lastName" name="lastName" required defaultValue={initialData?.lastName} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-slate-600 mb-2">Phone Number</label>
            <input type="text" id="phone" name="phone" required defaultValue={initialData?.phone} />
          </div>
          <div>
            <label htmlFor="joinDate" className="block text-slate-600 mb-2">Joined Date</label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              required
              defaultValue={
                initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split("T")[0] : ""
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-slate-600 mb-2">Bio (Optional)</label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className="resize-none placeholder:text-slate-400 w-full"
              placeholder="brief description..."
              defaultValue={initialData?.bio}
            />
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
            <input type="text" id="position" name="position" required defaultValue={initialData?.position} />
          </div>
          <div>
            <label htmlFor="basicSalary" className="block text-slate-600 mb-2">Basic Salary</label>
            <input
              type="number"
              id="basicSalary"
              name="basicSalary"
              min={0}
              step={0.01}
              required
              defaultValue={initialData?.basicSalary ?? 0}
            />
          </div>
          <div>
            <label htmlFor="allowance" className="block text-slate-600 mb-2">Allowance</label>
            <input
              type="number"
              id="allowance"
              name="allowance"
              min={0}
              step={0.01}
              required
              defaultValue={initialData?.allowances ?? 0}
            />
          </div>
          <div>
            <label htmlFor="deductions" className="block text-slate-600 mb-2">Deductions</label>
            <input
              type="number"
              id="deductions"
              name="deductions"
              min={0}
              step={0.01}
              required
              defaultValue={initialData?.deductions ?? 0}
            />
          </div>
          {isEditing && (
            <div>
              <label htmlFor="employmentStatus" className="block text-slate-600 mb-2">Status</label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                required
                defaultValue={initialData?.employmentStatus || "ACTIVE"}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* account setup */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">Account Setup</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-slate-600 mb-2">Work Email</label>
            <input type="email" id="email" name="email" required defaultValue={initialData?.email} />
          </div>
          {!isEditing && (
            <div>
              <label htmlFor="password" className="block text-slate-600 mb-2">Temporary Password</label>
              <input type="password" id="password" name="password" required autoComplete="new-password" />
            </div>
          )}
          {isEditing && (
            <div>
              <label htmlFor="password" className="block text-slate-600 mb-2">Change Password (Optional)</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="leave blank to keep current"
                autoComplete="new-password"
              />
            </div>
          )}
          <div>
            <label htmlFor="systemRole" className="block text-slate-600 mb-2">System Role</label>
            <select
              id="systemRole"
              name="systemRole"
              required
              defaultValue={initialData?.user?.role || "EMPLOYEE"}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center">
          {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          {isEditing ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
};
