import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Welcome back,
            <span className="text-blue-600"> {user?.name || "User"}</span> 👋
          </h2>

          <p className="text-gray-500 mt-1 text-sm">{today}</p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          {/* Notification */}
          <div className="relative cursor-pointer">
            <div className="text-2xl hover:scale-110 transition">🔔</div>

            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {initials}
            </div>

            <div className="hidden md:block">
              <p className="font-semibold text-slate-800">{user?.name}</p>

              <p className="text-sm capitalize text-slate-500">{user?.role}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600
            text-white
            px-5
            py-2.5
            rounded-xl
            shadow-lg
            hover:shadow-red-300
            hover:scale-105
            transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
