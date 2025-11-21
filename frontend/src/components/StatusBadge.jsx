// src/components/StatusBadge.jsx
import React from "react";

export default function StatusBadge({ status }) {
  const colors = {
    submitted: "bg-gray-200 text-gray-800",
    reviewing: "bg-yellow-200 text-yellow-800",
    shortlisted: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || "bg-gray-200 text-gray-800"}`}>
      {status}
    </span>
  );
}
