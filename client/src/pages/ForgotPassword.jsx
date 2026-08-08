import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "🔒 Password reset will be available in the production version.\n\nPlease contact the administrator for demo access.",
    );

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl w-96 shadow-lg"
      >
        <h1 className="text-3xl text-white font-bold mb-2">
          🔑 Forgot Password
        </h1>

        <p className="text-slate-400 mb-6">
          Enter your registered email address.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6 outline-none border border-slate-700 focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Reset Password
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-slate-400 hover:text-white"
        >
          ← Back to Login
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
