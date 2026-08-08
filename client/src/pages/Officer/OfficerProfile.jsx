import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getAssignedComplaints } from "../../services/officerService";

function OfficerProfile() {
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
      <h1 className="text-4xl font-bold mb-8">👤 My Profile</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Officer Information</h2>

          <div className="space-y-4">
            <div>
              <strong>Name</strong>
              <p>{user?.name}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{user?.email}</p>
            </div>

            <div>
              <strong>Phone</strong>
              <p>{user?.phone || "Not Available"}</p>
            </div>

            <div>
              <strong>Department</strong>
              <p>{user?.department}</p>
            </div>

            <div>
              <strong>Role</strong>
              <p className="capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Work Statistics</h2>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span>Total Assigned</span>
              <strong>{assigned}</strong>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>
              <strong>{inProgress}</strong>
            </div>

            <div className="flex justify-between">
              <span>Resolved</span>
              <strong>{resolved}</strong>
            </div>

            <div className="flex justify-between">
              <span>Total Complaints</span>
              <strong>{complaints.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OfficerProfile;
