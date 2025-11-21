import express from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "../controllers/jobController.js";
import { protect, hrOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getJobs);
router.get("/:id", getJobById);

// HR-only
router.post("/", protect, hrOnly, createJob);
router.put("/:id", protect, hrOnly, updateJob);
router.delete("/:id", protect, hrOnly, deleteJob);

export default router;
