import { useState } from "react";

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label className="block mb-2 text-white font-semibold">{label}</label>

      <div className="relative">
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
    w-full
    px-5
    py-4
    rounded-2xl
    bg-white/10
    text-white
    placeholder:text-slate-300
    border
    border-white/20
    backdrop-blur-md
    outline-none
    caret-cyan-400
    focus:ring-4
    focus:ring-cyan-400/30
    focus:border-cyan-400
    transition-all
    duration-300
  "
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            text-gray-500
            "
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputField;
