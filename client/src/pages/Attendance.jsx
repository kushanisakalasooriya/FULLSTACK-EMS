import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import CheckInButton from "../components/attendance/CheckInButton";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import api from "../api/axios";
import toast from "react-hot-toast";

const Attendance = () => {

  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/attendance");
      setHistory(res.data.data || []);
      setTodayRecord(res.data.todayRecord ?? null);
      if (res.data.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching attendance data"
      );
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hours & attendance record details</p>
      </div>

      {isDeleted ? (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <p className="text-rose-600">Cannot update the clock in & out because youe employee record marks as deleted.</p>
        </div>
      ) : (
        <div className="mb-8 relative min-h-[140px]">
          <CheckInButton todayRecord={todayRecord} onAction={fetchData} />
        </div>
      )}

      <AttendanceStats history={history} />
      <AttendanceHistory history={history} />

    </div>
  )
}

export default Attendance