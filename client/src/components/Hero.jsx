function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6">
      <p className="text-blue-500 font-semibold text-lg">
        AI Powered Smart City Platform
      </p>

      <h1 className="text-6xl md:text-7xl font-extrabold mt-4 leading-tight">
        Build Smarter <br />
        <span className="text-blue-500">Cities with AI</span>
      </h1>

      <p className="mt-6 text-gray-400 max-w-3xl text-xl">
        Report civic issues, track complaints, monitor city analytics, and
        empower authorities with Artificial Intelligence.
      </p>

      <div className="mt-10 flex gap-5">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl">
          Get Started
        </button>

        <button className="border border-slate-600 hover:bg-slate-800 px-8 py-4 rounded-xl">
          Live Demo
        </button>
      </div>
    </section>
  );
}

export default Hero;
