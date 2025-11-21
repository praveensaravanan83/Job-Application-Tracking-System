// src/pages/ApplicantsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    console.log("[ApplicantsPage] mount - jobId:", jobId);
    if (!jobId) {
      setError("No jobId provided in URL.");
      return;
    }
    setError(null);
    fetchJobDetails();
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      console.log("[ApplicantsPage] fetching job details for", jobId);
      const res = await api.get(`/jobs/${jobId}`);
      setJob(res.data);
      console.log("[ApplicantsPage] job details:", res.data);
    } catch (err) {
      console.error("[ApplicantsPage] fetchJobDetails error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load job details");
    }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      console.log("[ApplicantsPage] fetching applicants for", jobId);
      const res = await api.get(`/applications/job/${jobId}/applicants`);
      console.log("[ApplicantsPage] applicants response:", res);
      setApps(res.data || []);
    } catch (err) {
      console.error("[ApplicantsPage] fetchApplicants error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    setUpdating(prev => ({ ...prev, [appId]: true }));
    try {
      const res = await api.patch(`/applications/status/${appId}`, { status });
      alert(res.data?.message || "Status updated");
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      console.error("[ApplicantsPage] updateStatus error:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(prev => ({ ...prev, [appId]: false }));
    }
  };

  // UI: show errors clearly
  if (!user || user.role !== "hr") {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="glass-card p-6">
          <p className="text-gray-700">Access denied. HR only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 bg-gray-50">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Applicants</h2>
            <p className="muted">{job ? `${job.title} • ${job.company}` : "Loading job..."}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/hr")} className="btn-outline">Back to HR</button>
            <button onClick={fetchApplicants} className="btn-primary">Refresh</button>
          </div>
        </div>

        {/* Error box */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            <strong>Error:</strong> {error}
            <div className="mt-2 text-xs text-gray-500">Check console for full details.</div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading applicants...</div>
        ) : apps.length === 0 ? (
          <div className="text-gray-600">No applicants yet.</div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => (
              <div key={app._id} className="glass-card p-4 fade-in">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold">{app.candidateId?.name || app.candidateId?.email}</div>
                      <div className="muted text-sm">{app.candidateId?.email}</div>
                      <div><StatusBadge status={app.status} /></div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">
                      <div><strong>Education:</strong> {app.education || "—"}</div>
                      <div><strong>Mobile:</strong> {app.mobile || "—"}</div>
                      <div><strong>Address:</strong> {app.address || "—"}</div>
                      <div><strong>Experience:</strong> {app.experience || "Fresher / Not provided"}</div>
                    </div>

                    <div className="mt-2 text-sm">
                      <a
                        href={`http://localhost:5000/uploads/resumes/${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 underline"
                      >
                        View resume
                      </a>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">Applied on: {new Date(app.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      className="btn-primary"
                      onClick={() => updateStatus(app._id, "shortlisted")}
                      disabled={updating[app._id]}
                    >
                      Shortlist
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => updateStatus(app._id, "rejected")}
                      disabled={updating[app._id]}
                    >
                      Reject
                    </button>
                    <button
                      className="btn-outline"
                      onClick={() => updateStatus(app._id, "reviewing")}
                      disabled={updating[app._id]}
                    >
                      Reviewing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
