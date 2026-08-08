import { motion, useMotionValue, useSpring } from "framer-motion";

function MouseGlow() {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const x = useSpring(mouseX, {
    damping: 25,
    stiffness: 120,
  });

  const y = useSpring(mouseY, {
    damping: 25,
    stiffness: 120,
  });

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      onMouseMove={(e) => {
        mouseX.set(e.clientX - 150);
        mouseY.set(e.clientY - 150);
      }}
    >
      <motion.div
        style={{ x, y }}
        className="absolute w-[300px] h-[300px] rounded-full bg-cyan-400/10 blur-3xl"
      />
    </div>
  );
}

export default MouseGlow;
