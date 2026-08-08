function StatCard({ title, value, icon, color }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div
          className="text-4xl w-16 h-16 rounded-full flex justify-center items-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
