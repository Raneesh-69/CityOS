import { motion } from "framer-motion";

function FloatingBlobs() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-0 left-0"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
        className="absolute w-[420px] h-[420px] bg-cyan-500/15 rounded-full blur-3xl bottom-0 right-0"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute w-72 h-72 bg-purple-500/15 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2"
      />
    </>
  );
}

export default FloatingBlobs;
