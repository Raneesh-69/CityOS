import { useMemo } from "react";
import Particles from "@tsparticles/react";

function BackgroundParticles() {
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },

      fpsLimit: 60,

      particles: {
        number: {
          value: 60,
        },

        color: {
          value: ["#38bdf8", "#60a5fa", "#ffffff"],
        },

        links: {
          enable: true,
          distance: 150,
          color: "#60a5fa",
          opacity: 0.15,
          width: 1,
        },

        move: {
          enable: true,
          speed: 1,
        },

        opacity: {
          value: 0.4,
        },

        size: {
          value: {
            min: 2,
            max: 5,
          },
        },
      },

      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
        },

        modes: {
          grab: {
            distance: 180,
            links: {
              opacity: 0.5,
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0"
    />
  );
}

export default BackgroundParticles;
