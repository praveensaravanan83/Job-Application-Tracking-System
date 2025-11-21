// src/components/JobList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "./JobCard";

export default function JobList({ showOnlyPostedBy, onApplyComplete, onJobSelect, excludeJobs = [] }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({ q: "", location: "" });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      let data = res.data || [];
      if (showOnlyPostedBy) {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        data = data.filter(j => j.postedBy === user?.id || j.postedBy?._id === user?.id);
      }
      setJobs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = jobs.filter(j => {
    const q = filter.q.toLowerCase();
    const l = filter.location.toLowerCase();
    // hide jobs in excludeJobs
    const excluded = excludeJobs?.includes(j._id);
    return (
      !excluded &&
      (j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)) &&
      (!l || j.location?.toLowerCase().includes(l))
    );
  });

  return (
    <div>
      {/* Filter Inputs */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <input
          className="form-input flex-1"
          placeholder="Search by title, company or description"
          value={filter.q}
          onChange={(e) => setFilter(f => ({ ...f, q: e.target.value }))}
        />
        <input
          className="form-input w-48"
          placeholder="Location"
          value={filter.location}
          onChange={(e) => setFilter(f => ({ ...f, location: e.target.value }))}
        />
        <button className="btn-outline" onClick={fetchJobs}>Refresh</button>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-gray-500">Loading jobs...</div>
      ) : (
        <div className="grid gap-4">
          {filtered.length === 0 && <div className="text-gray-500">No jobs found.</div>}
          {filtered.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onApplied={() => {
                fetchJobs();
                if (onApplyComplete) onApplyComplete(job);
              }}
              onSelect={(job) => onJobSelect && onJobSelect(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
