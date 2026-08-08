function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white shadow-lg p-6">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

      <div className="h-12 w-24 bg-gray-200 rounded mb-4"></div>

      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>

      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>
  );
}

export default SkeletonCard;
