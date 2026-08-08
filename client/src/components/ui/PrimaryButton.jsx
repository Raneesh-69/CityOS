function PrimaryButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6
        py-3
        rounded-xl
        font-semibold
        text-white
        bg-gradient-to-r
        from-blue-600
        to-cyan-500
        hover:scale-105
        hover:shadow-xl
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
