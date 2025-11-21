// src/pages/CandidateDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import JobList from "../components/JobList";
import api from "../api/axios";

export default function CandidateDashboard() {
  const { user, logout } = useAuth();
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyApps = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/my/applications");
      setMyApps(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyApps(); }, []);

  return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <div className="glass-card p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
            <p className="text-sm text-gray-600">Role: {user?.role}</p>
          </div>
          <div>
            <button onClick={logout} className="btn-outline">Logout</button>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-3">Available Jobs</h2>
          <JobList onApplyComplete={fetchMyApps} excludeJobs={myApps.map(app => app.jobId?._id)} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">My Applications</h2>
          {loading ? <div>Loading...</div> : (
            <div className="space-y-3">
              {myApps.length === 0 && <div className="text-gray-700">You haven't applied to any jobs yet.</div>}
              {myApps.map(app => (
                <div key={app._id} className="glass-card p-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{app.jobId?.title}</div>
                      <div className="text-sm text-gray-600">{app.jobId?.company} • {app.jobId?.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Status: <span className="font-semibold">{app.status}</span></div>
                      <a className="text-sm underline text-indigo-600" href={`http://localhost:5000/uploads/resumes/${app.resume}`} target="_blank" rel="noreferrer">View resume</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
