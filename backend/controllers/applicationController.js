import Application from "../models/Application.js";

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Prevent multiple applications by same candidate for same job
    const existing = await Application.findOne({
      jobId,
      candidateId: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // Validate resume file
    if (!req.file) {
      return res.status(400).json({ message: "Resume (PDF) is required" });
    }
    const resumePath = req.file.filename;

    // Read additional fields from body (education, mobile, address, experience)
    const { education = "", mobile = "", address = "", experience = "" } = req.body;

    const newApp = await Application.create({
      jobId,
      candidateId: req.user.id,
      resume: resumePath,
      education,
      mobile,
      address,
      experience
    });

    res.json({ message: "Application submitted", application: newApp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ candidateId: req.user.id })
            .populate("jobId");

        res.json(apps);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getApplicantsForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        const apps = await Application.find({ jobId })
            .populate("candidateId")
            .populate("jobId");

        res.json(apps);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// add this export in controllers/applicationController.js
export const updateApplicationStatus = async (req, res) => {
  try {
    const appId = req.params.appId;
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(appId, { status }, { new: true });
    return res.json({ message: "Status updated", application: app });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
