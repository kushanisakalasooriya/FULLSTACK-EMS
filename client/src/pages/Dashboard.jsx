import { useEffect, useState } from "react";
import { dummyEmployeeDashboardData, dummyAdminDashboardData } from "../assets/assets";
import Loading from "../components/Loading";
import EmploeeDashboard from "../components/EmploeeDashboard";
import AdminDashboard from "../components/AdminDashboard";


export const Dashboard = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(dummyEmployeeDashboardData)
    //setData(dummyAdminDashboardData)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

  if (loading) {
    return <Loading/>
  }
  if (!data) {
    return <p className="text-center text-slate-500 py-12">Error loading data</p>
  }

  if(data.role === "ADMIN") {
    return (
     <AdminDashboard data={data} />
    )
  }
  else {
    return (
      <EmploeeDashboard data={data} />
    )
  }

}

export default Dashboard
