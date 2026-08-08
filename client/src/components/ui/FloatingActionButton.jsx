function FloatingActionButton({ onClick, icon = "+" }) {
  return (
    <button
      onClick={onClick}
      className="
      fixed
      bottom-8
      right-8
      w-16
      h-16
      rounded-full
      bg-gradient-to-r
      from-blue-600
      to-cyan-500
      text-white
      text-3xl
      shadow-2xl
      hover:scale-110
      transition-all
      z-50
      "
    >
      {icon}
    </button>
  );
}

export default FloatingActionButton;
