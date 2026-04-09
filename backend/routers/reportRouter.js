import express from "express";
import Report from "../models/reportModel.js";
import Event from "../models/eventModel.js";

const router = express.Router();

// 🔥 CREATE REPORT
router.post("/", async (req, res) => {
  try {
    console.log("REQUEST HIT");
    console.log("BODY:", req.body);

    const { eventId, userId, reason } = req.body;

    if (!eventId || !userId || !reason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const report = new Report({
      eventId,
      userId,
      reason,
    });

    await report.save();

    console.log("✅ REPORT SAVED");

    res.json({ message: "Report saved" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL REPORTS
router.get("/", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json({
      message: "Report updated",
      report,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating report",
      error: err.message,
    });
  }
});

export default router;