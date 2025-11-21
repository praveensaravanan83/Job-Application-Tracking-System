// src/components/ApplicantList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ApplicantList({ jobId, onUpdateStatus, refreshKey }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApps = async () => {
    if (!jobId) {
      setApps([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}/applicants`);
      setApps(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, [jobId, refreshKey]);

  const updateStatus = async (appId, status) => {
    const action = () => {
      if (onUpdateStatus) return onUpdateStatus(appId, status);
      return api.patch(`/applications/status/${appId}`, { status });
    };
    try {
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      const res = await action();
      if (!onUpdateStatus) {
        alert(res.data?.message || `Status updated to ${status}`);
        fetchApps();
      } else {
        alert(res?.data?.message || `Status update requested: ${status}`);
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
      fetchApps();
    }
  };

  if (!jobId) return <div className="text-gray-500">Select a job to view applicants</div>;

  return (
    <div className="space-y-4">
      {loading && <div className="text-gray-500">Loading applicants...</div>}
      {apps.length === 0 && !loading && <div className="text-gray-500">No applicants yet.</div>}
      {apps.map(app => (
        <div key={app._id} className="glass-card p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{app.candidateId?.name || app.candidateId?.email}</div>
              <div className="text-sm text-gray-600">{app.candidateId?.email}</div>
              <div className="text-sm text-gray-500 mt-1">Applied on: {new Date(app.createdAt).toLocaleString()}</div>
            </div>

            <div className="text-right space-y-2">
              {app.resume ? (
                <a
                  href={`https://job-tracking-backend-yejq.onrender.com/uploads/resumes/${app.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline text-indigo-600"
                >
                  View Resume
                </a>
              ) : null}

              <div className="text-sm text-gray-700">
                Status: <span className="font-semibold">{app.status}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button className="btn-primary flex-1" onClick={() => updateStatus(app._id, "shortlisted")}>Shortlist</button>
            <button className="btn-danger flex-1" onClick={() => updateStatus(app._id, "rejected")}>Reject</button>
            <button className="btn-outline flex-1" onClick={() => updateStatus(app._id, "reviewing")}>Reviewing</button>
          </div>
        </div>
      ))}
    </div>
  );
}

