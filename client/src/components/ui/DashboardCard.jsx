function DashboardCard({ children }) {
  return (
    <div
      className="
      bg-white/10
      backdrop-blur-xl
      border border-white/20
      rounded-3xl
      p-8
      shadow-2xl
      text-white
      [&_p]:text-slate-300
      [&_h1]:text-white
      [&_h2]:text-white
      [&_h3]:text-white
      transition-all
      duration-300
      hover:bg-white/15
      "
    >
      {children}
    </div>
  );
}

export default DashboardCard;
