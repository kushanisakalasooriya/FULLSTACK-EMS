import { useEffect, useState } from "react";
import api from "../api/axios";
import Loading from "../components/Loading";
import EmploeeDashboard from "../components/EmploeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: payload } = await api.get("/dashboard");
        if (!cancelled) setData(payload);
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.message ||
          "Failed to load dashboard data. Please try again.";
        if (!cancelled) {
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <p className="text-center text-rose-600 py-12">{error}</p>
    );
  }
  if (!data) {
    return (
      <p className="text-center text-slate-500 py-12">Error loading data</p>
    );
  }

  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />;
  }
  return <EmploeeDashboard data={data} />;
};

export default Dashboard;
