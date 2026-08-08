import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ title, links, user, children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar title={title} links={links} />

      <div className="flex-1 flex flex-col">
        <Navbar user={user} />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
