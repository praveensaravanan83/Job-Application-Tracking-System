// backend/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // NEW fields
  education: { type: String, default: "" },      // education details (degree, college)
  mobile: { type: String, default: "" },         // mobile number as string
  address: { type: String, default: "" },        // address text
  experience: { type: String, default: "" },     // experience details (e.g., "2 years at X" or "Fresher")

  resume: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["submitted", "reviewing", "shortlisted", "rejected"],
    default: "submitted"
  }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
