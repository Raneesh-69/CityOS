function SkeletonTable() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded mb-4" />
      ))}
    </div>
  );
}

export default SkeletonTable;
