import GradientBackground from "./GradientBackground";
import FloatingBlobs from "./FloatingBlobs";
import BackgroundParticles from "./BackgroundParticles";
import MouseGlow from "./MouseGlow";

function PageContainer({ children }) {
  return (
    <GradientBackground>
      <MouseGlow />

      <BackgroundParticles />

      <FloatingBlobs />

      <div className="relative z-10 min-h-screen px-8 py-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </GradientBackground>
  );
}

export default PageContainer;
