import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, MapPin, Image as ImageIcon, Send } from "lucide-react";

import { createComplaint } from "../services/complaintService";

import PageContainer from "../components/ui/PageContainer";
import FormContainer from "../components/ui/FormContainer";
import InputField from "../components/ui/InputField";
import TextArea from "../components/ui/TextArea";
import SelectField from "../components/ui/SelectField";
import PrimaryButton from "../components/ui/PrimaryButton";

function ReportComplaint() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => alert("Unable to fetch location."),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);

      if (location) {
        formData.append("location", JSON.stringify(location));
      }

      if (image) {
        formData.append("image", image);
      }

      const response = await createComplaint(formData);

      alert(response.message);

      setForm({
        title: "",
        description: "",
        category: "",
      });

      setImage(null);
      setPreview("");
      setLocation(null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer
        title="📋 Report New Complaint"
        subtitle="Help improve your city by reporting civic issues."
      >
        <form onSubmit={handleSubmit}>
          <InputField
            label="Complaint Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter complaint title"
          />

          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the issue in detail..."
          />

          <div className="text-right text-slate-400 text-sm mb-6">
            {form.description.length}/500 characters
          </div>

          <div className="mb-8">
            <label className="block text-white font-semibold mb-4">
              Select Category
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "🛣️",
                  name: "Road Damage",
                },
                {
                  icon: "🗑️",
                  name: "Garbage",
                },
                {
                  icon: "💡",
                  name: "Street Light",
                },
                {
                  icon: "💧",
                  name: "Water Leakage",
                },
                {
                  icon: "🚰",
                  name: "Drainage",
                },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      category: item.name,
                    })
                  }
                  className={`
        p-5
        rounded-2xl
        border
        transition-all
        duration-300
        backdrop-blur-xl
        ${
          form.category === item.name
            ? "bg-cyan-500 border-cyan-300 text-white scale-105 shadow-xl"
            : "bg-white/10 border-white/20 text-slate-200 hover:bg-white/20 hover:scale-105"
        }
        `}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>

                  <div className="font-semibold">{item.name}</div>
                </button>
              ))}
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Upload Complaint Image
            </label>

            <label
              className="
              border-2
              border-dashed
              border-cyan-400/40
              rounded-2xl
              p-10
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              bg-white/5
              hover:bg-white/10
              transition
              "
            >
              <Upload size={50} className="text-cyan-300" />

              <p className="text-slate-300 mt-4">Click to upload an image</p>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </motion.div>

          {preview && (
            <div className="mb-8">
              <img
                src={preview}
                alt="Preview"
                className="rounded-2xl w-full max-h-96 object-cover border border-white/20"
              />
            </div>
          )}

          <button
            type="button"
            onClick={getLocation}
            className="
            w-full
            mb-5
            rounded-2xl
            bg-gradient-to-r
            from-green-600
            to-emerald-500
            py-4
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            "
          >
            <MapPin size={22} />
            Get Current Location
          </button>

          {location && (
            <div className="mb-8 rounded-2xl bg-white/10 p-5 border border-white/20">
              <div className="flex items-center gap-3 text-green-400 mb-2">
                <ImageIcon size={20} />

                <span>Location Captured</span>
              </div>

              <p className="text-slate-300">Latitude : {location.latitude}</p>

              <p className="text-slate-300">Longitude : {location.longitude}</p>
            </div>
          )}

          <PrimaryButton
            type="submit"
            className="w-full flex justify-center items-center gap-3"
          >
            <Send size={20} />

            {loading ? "Submitting..." : "Submit Complaint"}
          </PrimaryButton>
        </form>
      </FormContainer>
    </PageContainer>
  );
}

export default ReportComplaint;
