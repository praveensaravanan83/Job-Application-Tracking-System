// src/components/ApplicantFormModal.jsx
import React, { useState } from "react";
import api from "../api/axios";

export default function ApplicantFormModal({ job, open, onClose, onApplied }) {
  const [education, setEducation] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please attach your resume (PDF).");
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("education", education);
      form.append("mobile", mobile);
      form.append("address", address);
      form.append("experience", experience);

      const res = await api.post(`/applications/${job._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(res.data.message || "Applied successfully");
      if (onApplied) onApplied();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Application failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Apply for: {job.title}</h3>
          <button onClick={onClose} className="btn-outline">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <div className="text-sm text-gray-700 mb-1">Education (degree / college)</div>
            <input required value={education} onChange={(e)=>setEducation(e.target.value)} className="form-input" placeholder="e.g. B.Tech - Computer Science, XYZ University" />
          </label>

          <label className="block">
            <div className="text-sm text-gray-700 mb-1">Mobile</div>
            <input required value={mobile} onChange={(e)=>setMobile(e.target.value)} className="form-input" placeholder="e.g. +91XXXXXXXXXX" />
          </label>

          <label className="block">
            <div className="text-sm text-gray-700 mb-1">Address</div>
            <input value={address} onChange={(e)=>setAddress(e.target.value)} className="form-input" placeholder="City, State, Country" />
          </label>

          <label className="block">
            <div className="text-sm text-gray-700 mb-1">Work Experience (if any)</div>
            <input value={experience} onChange={(e)=>setExperience(e.target.value)} className="form-input" placeholder="e.g. 2 years at ABC Corp — frontend work" />
          </label>

          <label className="block">
            <div className="text-sm text-gray-700 mb-1">Resume (PDF)</div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full"
            />
            <div className="text-xs text-gray-500 mt-1">Only PDF allowed. Max recommended size 5MB.</div>
          </label>

          <div className="flex gap-2 justify-end mt-3">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
