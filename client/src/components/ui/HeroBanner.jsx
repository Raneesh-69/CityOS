function HeroBanner({ title, subtitle }) {
  return (
    <div
      className="
      bg-white/10
      backdrop-blur-xl
      border
      border-white/20
      rounded-3xl
      p-10
      mb-10
      shadow-2xl
      "
    >
      <h1 className="text-5xl font-black text-white">{title}</h1>

      <p className="text-slate-300 mt-4 text-xl">{subtitle}</p>
    </div>
  );
}

export default HeroBanner;
