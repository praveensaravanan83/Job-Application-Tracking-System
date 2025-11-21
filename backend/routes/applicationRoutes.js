import express from "express";
import { protect, hrOnly } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";
import { applyJob, getMyApplications, getApplicantsForJob, updateApplicationStatus  } from "../controllers/applicationController.js";

const router = express.Router();

// Candidate applies
router.post("/:jobId", protect, uploadResume.single("resume"), applyJob);

// Candidate views his applications
router.get("/my/applications", protect, getMyApplications);

// HR views applicants for a job
router.get("/job/:jobId/applicants", protect, hrOnly, getApplicantsForJob);

// HR updates status for an application (HR only)
router.patch("/status/:appId", protect, hrOnly, updateApplicationStatus);


// HR updates status for an application (HR only)
//router.patch("/status/:appId", protect, hrOnly, updateApplicationStatus);

export default router;

