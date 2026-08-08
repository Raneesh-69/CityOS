import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getComplaintDetails,
  updateOfficerComplaint,
} from "../services/officerService";
import ComplaintTimeline from "../components/ComplaintTimeline";
function OfficerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);

  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadComplaint();
  }, []);

  const loadComplaint = async () => {
    try {
      const data = await getComplaintDetails(id);

      console.log("DATA =", data);
      console.log("IMAGE =", data.image);
      console.log("Complaint Response:", data);
      console.log("Image:", data.image);
      console.log("Assigned Officer:", data.assignedOfficer);

      setComplaint(data);
      setStatus(data.status);
      setRemarks(data.remarks || "");
    } catch (error) {
      console.error(error);
      alert("Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("status", status);
      formData.append("remarks", remarks);

      if (image) {
        formData.append("image", image);
      }

      await updateOfficerComplaint(id, formData);

      alert("Complaint updated successfully");

      loadComplaint();
    } catch (error) {
      console.error(error);
      alert("Failed to update complaint");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white text-2xl">
        Complaint not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg mb-6"
      >
        ← Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Complaint Image */}

        <div className="bg-slate-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-5">Complaint Image</h2>

          {complaint.image ? (
            <img
              src={complaint.image}
              alt="Complaint"
              className="rounded-xl w-full"
            />
          ) : (
            <div className="h-80 flex items-center justify-center border rounded-xl text-gray-400">
              No Image Uploaded
            </div>
          )}
        </div>

        {/* Complaint Details */}

        <div className="bg-slate-900 rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-6">{complaint.title}</h1>

          <div className="space-y-4">
            <div>
              <strong>Description</strong>
              <p className="mt-1 text-gray-300">{complaint.description}</p>
            </div>

            <div>
              <strong>Category</strong>
              <p>{complaint.category}</p>
            </div>

            <div>
              <strong>Department</strong>
              <p>{complaint.department}</p>
            </div>

            <div>
              <strong>Priority</strong>
              <p>{complaint.priority}</p>
            </div>

            <div>
              <strong>Status</strong>
              <p>{complaint.status}</p>
            </div>

            <div>
              <strong>Citizen</strong>
              <p>{complaint.user?.name}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{complaint.user?.email}</p>
            </div>

            <div className="bg-blue-900 rounded-xl p-4 mt-5">
              <h2 className="text-xl font-bold mb-2">🤖 AI Summary</h2>

              <p>{complaint.aiSummary}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Complaint Timeline */}

      <ComplaintTimeline status={complaint.status} />

      {/* Update Section */}

      <div className="bg-slate-900 rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Update Complaint</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block mb-2">Status</label>

            <select
              className="w-full bg-slate-800 rounded-lg p-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Remarks</label>

            <textarea
              rows="5"
              className="w-full bg-slate-800 rounded-lg p-3"
              placeholder="Enter work details..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Completion Image</label>

            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          {complaint.completionImage && (
            <div>
              <h3 className="font-bold mb-2">Existing Completion Image</h3>

              <img
                src={complaint.completionImage}
                alt="Completed"
                className="rounded-lg w-72"
              />
            </div>
          )}

          <button
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg disabled:bg-gray-500"
          >
            {saving ? "Updating..." : "✅ Update Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OfficerComplaintDetails;
