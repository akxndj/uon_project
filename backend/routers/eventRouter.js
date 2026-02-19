import express from "express";
import Event from "../models/eventModel.js";

const router = express.Router();

// GET /api/events -> get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// GET /api/events/:eventId -> get event by id
router.get("/:eventId", async (req, res) => {
  const {eventId} = req.params;
  try{
    const event = await Event.findOne({eventId : eventId});
    if(!event)
    {
      return res.status(404).json({message: "Event not found!"});
    }
    res.json(event);
  }
  catch(error)
  {
    res.status(500).json({message: "Error fetching events!", error})
  }

});

// POST /api/events -> create new event
router.post("/", async(req, res) => {
  try{
    const newEvent = new Event({
      name: req.body.name,
      eventId: req.body.eventId, 
      date: req.body.date, 
      location: req.body.location,
      description: req.body.description,
      eligibility: req.body.eligibility,
      fee: req.body.fee,
      included: req.body.included,
      image: req.body.image,
      createdBy: req.body.createdBy,
      capacity: req.body.capacity,
      registered: req.body.registered                         
    });
    const savedEvent = await newEvent.save();
    res.status(201).json({message: "Event created successfully! ", event: savedEvent});
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message: "Error creating event!", error: err.message});
  }
});

export default router;
