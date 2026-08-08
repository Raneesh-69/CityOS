function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
      w-full
      md:w-80
      px-5
      py-3
      rounded-xl
      border
      border-gray-300
      bg-white
      shadow-sm
      focus:ring-4
      focus:ring-blue-200
      focus:border-blue-500
      outline-none
      transition-all
      "
    />
  );
}

export default SearchBar;
