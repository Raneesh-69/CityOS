function AnimatedInput({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
      w-full
      px-5
      py-4
      rounded-2xl
      border
      border-gray-300
      bg-white
      shadow-sm
      outline-none
      transition-all
      duration-300
      focus:border-blue-500
      focus:ring-4
      focus:ring-blue-200
      hover:shadow-md
      "
    />
  );
}

export default AnimatedInput;
