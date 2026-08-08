function SelectField({ label, value, onChange, name, children }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-white font-semibold">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
        w-full
        rounded-2xl
        bg-white/10
        border border-white/20
        text-white
        p-4
        outline-none
        backdrop-blur-md
        focus:ring-4
        focus:ring-cyan-400/30
        "
      >
        {children}
      </select>
    </div>
  );
}

export default SelectField;
