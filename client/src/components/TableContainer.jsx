function TableContainer({ title, children }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-blue-50">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>

      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default TableContainer;
