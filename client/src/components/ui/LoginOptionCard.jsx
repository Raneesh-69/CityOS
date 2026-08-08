import { motion } from "framer-motion";

function LoginOptionCard({ icon, title, description, color, onClick }) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="
      bg-white/10
      backdrop-blur-2xl
      border
      border-white/20
      rounded-3xl
      p-10
      shadow-2xl
      cursor-pointer
      transition-all
      "
      onClick={onClick}
    >
      <div
        className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mx-auto shadow-xl`}
      >
        {icon}
      </div>

      <h2 className="text-3xl text-white font-bold text-center mt-8">
        {title}
      </h2>

      <p className="text-slate-300 mt-5 text-center leading-8">{description}</p>
    </motion.div>
  );
}

export default LoginOptionCard;
