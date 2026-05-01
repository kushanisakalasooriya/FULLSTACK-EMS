import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import { Plus, Search, X } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import { EmployeeForm } from "../components/EmployeeForm";

const Employees = () => {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployees(dummyEmployeeData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees])

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase()) &&
    (selectedDepartment ? emp.department === selectedDepartment : true)
  );

  return (
    <div className="animate-fade-in">

      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage employee records and details</p>
        </div>
        <button onClick={()=> setShowCreateModal(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus size={16}/> Add Employee
        </button>
      </div>

      {/* search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input placeholder="Search here..." className="w-full pl-10" onChange={(e)=>setSearch(e.target.value)} value={search}/>
        </div>
        <select value={selectedDepartment} onChange={(e)=>setSelectedDepartment(e.target.value)} className="w-full sm:w-auto sm:min-w-[220px]">
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* employee list */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin size-8 rounded-full border-2 border-blue-500 border-t-transparent"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredEmployees.length === 0 ? (
            <p className="text-center text-slate-500 col-span-full">No employees found.</p>
          ) : (
            filteredEmployees.map((emp) => (
              <EmployeeCard key={emp._id} employee={emp} onDelete={fetchEmployees} onEdit={(e)=> setEditEmployee(e)} />
            ))
          )}

        </div>
      )}

      {/* create Employee Modal */}
      {showCreateModal && (
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=> setShowCreateModal(false)}>
          <div className="fixed inset-0"/>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
                  <p className="text-sm text-slate-500 mt-0.5">create new user account & employee profile</p>
                </div>
                <button onClick={()=> setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="p-6 pt-0">
                <EmployeeForm 
                  onSuccess={()=> {
                    setShowCreateModal(false);
                    fetchEmployees();
                  }}
                  onCancel={()=> setShowCreateModal(false)}
                />
              </div>
            </div>
        </div>
      )}

      {/* edit Employee Modal */}
      {editEmployee && (
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=> setEditEmployee(null)}>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                  <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                  <p className="text-sm text-slate-500 mt-0.5">update employee information</p>
              </div>
                <button onClick={()=> setEditEmployee(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
                </button>
            </div>
            <div className="p-6">
              <EmployeeForm 
                initialData={editEmployee} 
                onSuccess={()=> {
                  setEditEmployee(null);
                  fetchEmployees();
                }}
                onCancel={()=> setEditEmployee(null)}/>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Employees