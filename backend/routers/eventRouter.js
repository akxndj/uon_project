import express from "express";
import Event from "../models/eventModel.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET /api/events -> get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// GET single event
router.get("/:id", async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/events -> create new event with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newEvent = new Event({
      name: req.body.name,
      eventId: req.body.eventId,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      eligibility: req.body.eligibility,
      fee: req.body.fee,
      included: req.body.included,
      image: req.file ? req.file.path : "",
      createdBy: req.body.createdBy,
      capacity: req.body.capacity,
      registered: req.body.registered
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      message: "Event created successfully!",
      event: savedEvent
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating event!",
      error: err.message
    });
  }
});
// DELETE /api/events/:id  → delete event
router.delete("/:id", async (req, res) => {
  try {

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting event" });
  }
});
// UPDATE event
router.put("/:id", async (req, res) => {

  try {

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event: updatedEvent
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating event" });
  }

});
export default router;