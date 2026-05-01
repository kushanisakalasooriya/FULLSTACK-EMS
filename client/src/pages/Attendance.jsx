import { useCallback, useEffect, useState } from "react";
import { dummyAttendanceData } from "../assets/assets";
import Loading from "../components/Loading";
import CheckInButton from "../components/attendance/CheckInButton";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";

const Attendance = () => {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(null);

  const fetchData = useCallback(async () => {
    setHistory(dummyAttendanceData)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loading/>
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRecord = history.find((record) =>
    new Date(record.date).toDateString() === today.toDateString()
  );

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
        <div className="mb-8">
          <CheckInButton todayRecord={todayRecord} onAction={fetchData} />
        </div>
      )}

      <AttendanceStats history={history} />
      <AttendanceHistory history={history} />

    </div>
  )
}

export default Attendance