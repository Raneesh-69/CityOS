function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
      bg-white/12
      backdrop-blur-3xl
      border border-white/15
      rounded-3xl
      shadow-[0_20px_60px_rgba(0,0,0,0.35)]
      transition-all
      duration-300
      ${className}
      `}
    >
      {children}
    </div>
  );
}

export default GlassCard;
