import { Routes, Route } from "react-router-dom";

import LoginSelection from "./pages/LoginSelection";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";
import CitizenComplaintDetails from "./pages/CitizenComplaintDetails";
import OfficerLogin from "./pages/OfficerLogin";
import OfficerDashboard from "./pages/Officer/OfficerDashboard";
import OfficerProfile from "./pages/Officer/OfficerProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddOfficer from "./pages/AddOfficer";
import ManageOfficers from "./pages/Admin/ManageOfficers";
import OfficerHome from "./pages/Officer/OfficerHome";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ManageComplaints from "./pages/Admin/ManageComplaints";
import AdminComplaintDetails from "./pages/Admin/ComplaintDetails";
import OfficerComplaintDetails from "./pages/OfficerComplaintDetails";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import ManageCitizens from "./pages/Admin/ManageCitizens";
function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LoginSelection />} />

      {/* Citizen Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Officer Authentication */}
      <Route path="/officer/login" element={<OfficerLogin />} />

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Citizen Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <ProtectedRoute allowedRole="citizen">
            <ReportComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-complaints"
        element={
          <ProtectedRoute allowedRole="citizen">
            <MyComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/:id"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenComplaintDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Officer Routes */}
      <Route
        path="/officer"
        element={
          <ProtectedRoute allowedRole="officer">
            <OfficerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/assigned"
        element={
          <ProtectedRoute allowedRole="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/complaints/:id"
        element={<OfficerComplaintDetails />}
      />

      <Route
        path="/officer/profile"
        element={
          <ProtectedRoute allowedRole="officer">
            <OfficerProfile />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-officer"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddOfficer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminComplaintDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/citizens" element={<ManageCitizens />} />
      <Route
        path="/admin/officers"
        element={
          <ProtectedRoute allowedRole="admin">
            <ManageOfficers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
