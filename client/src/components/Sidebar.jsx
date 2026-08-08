import { NavLink } from "react-router-dom";

function Sidebar({ links, title }) {
  return (
    <aside className="w-72 bg-slate-950 text-white min-h-screen border-r border-slate-800 shadow-2xl flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h1>

        <p className="text-slate-400 text-sm mt-2 tracking-wide">
          Smart City Management Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={
              link.path === "/officer" ||
              link.path === "/admin" ||
              link.path === "/dashboard"
            }
            className={({ isActive }) =>
              `group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium
              ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-900/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <span className="text-xl transition-transform duration-300 group-hover:scale-110">
              {link.icon}
            </span>

            <span className="text-[15px] tracking-wide">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-6">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <p className="text-sm font-semibold text-white">CityOS AI</p>

          <p className="text-xs text-slate-400 mt-1">
            Smart Governance Platform
          </p>

          <div className="mt-3 h-2 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            System Status: Online
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
