import GlassCard from "./GlassCard";

function AuthCard({ title, subtitle, children }) {
  return (
    <GlassCard className="max-w-md w-full mx-auto p-10">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏙️</div>

        <h1 className="text-4xl font-black text-white">{title}</h1>

        <p className="text-slate-300 mt-3">{subtitle}</p>
      </div>

      {children}
    </GlassCard>
  );
}

export default AuthCard;
