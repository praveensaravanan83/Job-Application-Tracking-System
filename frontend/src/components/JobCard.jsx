// src/components/JobCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicantFormModal from "./ApplicantFormModal";

export default function JobCard({ job, onApplied, selected }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const goToApplicants = () => {
    console.log("[JobCard] navigate to applicants for job:", job._id);
    navigate(`/hr/job/${job._id}/applicants`);
  };

  return (
    <>
      <div className={`relative group glass-card p-5 transition-all duration-150 ${selected ? "ring-2 ring-indigo-300" : ""}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-700">{job.salary || "-"}</div>
            <div className="text-xs text-gray-500">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700">{(job.description||"").slice(0,220)}{job.description && job.description.length > 220 ? "…" : ""}</p>

        <div className="mt-4 flex items-center gap-3">
          {user?.role === "candidate" && (
            <button onClick={() => setModalOpen(true)} className="btn-primary">Apply (PDF)</button>
          )}

          {user?.role === "hr" && (
            <button onClick={goToApplicants} className="btn-outline">View Applicants</button>
          )}
        </div>
      </div>

      <ApplicantFormModal
        job={job}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApplied={onApplied}
      />
    </>
  );
}
