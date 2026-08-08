import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getAssignedComplaints } from "../../services/officerService";

function OfficerHome() {
  const [complaints, setComplaints] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const officerLinks = [
    { label: "Dashboard", path: "/officer", icon: "🏠" },
    { label: "Assigned", path: "/officer/assigned", icon: "📋" },
    { label: "Profile", path: "/officer/profile", icon: "👤" },
  ];
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getAssignedComplaints();
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  const assigned = complaints.filter((c) => c.status === "Assigned").length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;

  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <DashboardLayout title="Officer Panel" links={officerLinks} user={user}>
      <h1 className="text-4xl font-bold mb-8">Officer Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Assigned</h3>
          <p className="text-4xl font-bold text-blue-600">{assigned}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">In Progress</h3>
          <p className="text-4xl font-bold text-yellow-600">{inProgress}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Resolved</h3>
          <p className="text-4xl font-bold text-green-600">{resolved}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Complaints</h2>

        {complaints.slice(0, 5).map((complaint) => (
          <div key={complaint._id} className="border-b py-3">
            <p className="font-semibold">{complaint.title}</p>

            <p className="text-gray-500">{complaint.status}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default OfficerHome;
