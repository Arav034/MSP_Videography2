export default function FileStatusBadge({ status }) {
  const statusStyles = {
    Uploaded: "bg-green-50 text-green-700",
    Processing: "bg-blue-50 text-blue-700",
    Failed: "bg-red-50 text-red-700",
    Pending: "bg-yellow-50 text-yellow-700",
  };

  const style = statusStyles[status] || "bg-gray-50 text-gray-700";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}