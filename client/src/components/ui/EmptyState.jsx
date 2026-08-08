function EmptyState({ title, description, icon = "📭", action }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
      <div className="text-7xl mb-6">{icon}</div>

      <h2 className="text-3xl font-bold text-slate-800">{title}</h2>

      <p className="text-slate-500 mt-4 text-lg">{description}</p>

      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export default EmptyState;
