function StatusBadge({ status }) {
  let bg = "bg-gray-500";

  if (status === "Pending") {
    bg = "bg-yellow-500";
  }

  if (status === "In Progress") {
    bg = "bg-blue-500";
  }

  if (status === "Resolved") {
    bg = "bg-green-600";
  }

  return (
    <span className={`${bg} text-white px-3 py-1 rounded-full text-sm`}>
      {status}
    </span>
  );
}

export default StatusBadge;
