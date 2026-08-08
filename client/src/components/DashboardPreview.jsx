function DashboardPreview() {
  return (
    <section className="px-10 py-20">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8">
          Admin Dashboard Preview
        </h2>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-gray-400">Total Complaints</p>
            <h1 className="text-4xl font-bold text-blue-500 mt-2">12,540</h1>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-gray-400">Resolved</p>
            <h1 className="text-4xl font-bold text-green-500 mt-2">10,920</h1>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-gray-400">Pending</p>
            <h1 className="text-4xl font-bold text-yellow-500 mt-2">1,620</h1>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-gray-400">City Score</p>
            <h1 className="text-4xl font-bold text-purple-500 mt-2">87%</h1>
          </div>
        </div>

        <div className="mt-10 bg-slate-800 rounded-2xl h-72 flex items-center justify-center text-gray-400 text-2xl">
          📊 AI Analytics & City Heatmap (Coming Soon)
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
