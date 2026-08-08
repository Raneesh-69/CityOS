import GradientBackground from "./GradientBackground";

function AuthLayout({ children }) {
  return (
    <GradientBackground>
      <div
        className="
      min-h-screen
      flex
      items-center
      justify-center
      p-6
      "
      >
        {children}
      </div>
    </GradientBackground>
  );
}

export default AuthLayout;
