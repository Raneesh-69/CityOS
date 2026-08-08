function FormContainer({ title, subtitle, children }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-3xl
        shadow-2xl
        p-10
        "
      >
        <h1 className="text-4xl font-black text-white">{title}</h1>

        <p className="text-slate-300 mt-3 mb-10">{subtitle}</p>

        {children}
      </div>
    </div>
  );
}

export default FormContainer;
