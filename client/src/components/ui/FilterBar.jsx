function FilterBar({ value, onChange, options = [] }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
      px-5
      py-3
      rounded-xl
      border
      border-gray-300
      bg-white
      shadow-sm
      focus:ring-4
      focus:ring-blue-200
      outline-none
      "
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

export default FilterBar;
