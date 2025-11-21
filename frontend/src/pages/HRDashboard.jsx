// src/pages/HRDashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import JobList from "../components/JobList";
import ApplicantList from "../components/ApplicantList";

export default function HRDashboard() {
  const { user, logout } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [appRefresh, setAppRefresh] = useState(0);

  const createJob = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", { title, company, location, salary, description });
      alert(res.data.message || "Job created");
      setTitle(""); setCompany(""); setLocation(""); setSalary(""); setDescription("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed");
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      const res = await api.patch(`/applications/status/${appId}`, { status });
      alert(res.data.message || "Status updated");
      setAppRefresh(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">HR Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={logout} className="btn-outline">Logout</button>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Post a New Job</h2>
          <form onSubmit={createJob} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Job title" className="form-input" />
            <input required value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="form-input" />
            <input required value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="form-input" />
            <input value={salary} onChange={e=>setSalary(e.target.value)} placeholder="Salary" className="form-input" />
            <textarea required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="form-input md:col-span-2"></textarea>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary">Create Job</button>
            </div>
          </form>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">All Jobs</h2>
          <JobList showOnlyPostedBy={true} onJobSelect={(job) => setSelectedJobId(job?._id)} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Applicants</h2>
          <div className="text-sm text-gray-600 mb-2">Select a job to view applicants</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* Small selector panel still uses JobList to show posted jobs */}
              <JobList showOnlyPostedBy={true} onJobSelect={(job) => setSelectedJobId(job?._id)} />
            </div>
            <div>
              <ApplicantList jobId={selectedJobId} onUpdateStatus={updateApplicationStatus} refreshKey={appRefresh} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
