function GradientBackground({ children }) {
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl -top-20 -left-20"></div>

      <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-3xl bottom-0 right-0"></div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default GradientBackground;
