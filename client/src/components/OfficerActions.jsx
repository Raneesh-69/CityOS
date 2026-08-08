import { useState } from "react";
import { updateOfficerComplaint } from "../services/officerService";
import { toast } from "react-hot-toast";

function OfficerActions({ complaint, onUpdated }) {
  const [remarks, setRemarks] = useState(complaint.remarks || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start Work
  const handleStartWork = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("status", "In Progress");
      formData.append("remarks", remarks);

      await updateOfficerComplaint(complaint._id, formData);

      toast.success("Work Started");

      if (onUpdated) {
        onUpdated();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update complaint",
      );
    } finally {
      setLoading(false);
    }
  };

  // Resolve Complaint
  const handleResolve = async () => {
    try {
      if (!remarks.trim()) {
        toast.error("Please enter remarks before resolving.");
        return;
      }

      if (!image) {
        toast.error("Please upload a completion image.");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("status", "Resolved");
      formData.append("remarks", remarks);
      formData.append("image", image);

      await updateOfficerComplaint(complaint._id, formData);

      toast.success("Complaint Resolved Successfully");

      if (onUpdated) {
        onUpdated();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to resolve complaint",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Officer Actions</h3>

      <textarea
        placeholder="Enter remarks..."
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        rows={4}
        className="w-full p-3 rounded-lg border mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />

      {image && <p className="text-green-600 mb-4">Selected: {image.name}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleStartWork}
          disabled={loading || complaint.status !== "Assigned"}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
        >
          ▶ Start Work
        </button>

        <button
          onClick={handleResolve}
          disabled={loading || complaint.status === "Resolved"}
          className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
        >
          ✅ Resolve
        </button>
      </div>
    </div>
  );
}

export default OfficerActions;
