function TextArea({ label, name, value, onChange, rows = 5, placeholder }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-white font-semibold">{label}</label>

      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
        w-full
        rounded-2xl
        bg-white/10
        border border-white/20
        text-white
        placeholder:text-slate-400
        p-5
        outline-none
        backdrop-blur-md
        focus:ring-4
        focus:ring-cyan-400/30
        "
      />
    </div>
  );
}

export default TextArea;
