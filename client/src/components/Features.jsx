import { Brain, MapPinned, BellRing, BarChart3 } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Brain size={40} className="text-blue-500" />,
      title: "AI Classification",
      desc: "Automatically classifies complaints into the correct department.",
    },
    {
      icon: <MapPinned size={40} className="text-green-500" />,
      title: "Live City Map",
      desc: "View complaints, priorities, and hotspots on an interactive map.",
    },
    {
      icon: <BellRing size={40} className="text-yellow-500" />,
      title: "Smart Notifications",
      desc: "Citizens receive real-time complaint status updates.",
    },
    {
      icon: <BarChart3 size={40} className="text-purple-500" />,
      title: "AI Analytics",
      desc: "Powerful dashboards with insights and department performance.",
    },
  ];

  return (
    <section className="py-24 px-10">
      <h2 className="text-4xl font-bold text-center mb-14">
        Why Choose <span className="text-blue-500">CityOS AI</span>?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition"
          >
            {feature.icon}

            <h3 className="text-2xl font-bold mt-6">{feature.title}</h3>

            <p className="text-gray-400 mt-4">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
