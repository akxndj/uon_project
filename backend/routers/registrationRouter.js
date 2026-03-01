import express from "express";
import EventRegistration from "../models/registrationModel.js";

const router = express.Router();

router.post("/", async(req, res) => {
  try{
    const {eventId, userId} = req.body;

    let registration = await EventRegistration.findOne({eventId});

    if(!registration)
    {
        registration = new EventRegistration({
            eventId,
            registeredAttendees: 1,
            attendees: [userId],            
    });
    }
    else
    {
        if(registration.attendees.includes(userId))
        {
            return res.status(400).json({message: "user already registered"});
        }
        registration.registeredAttendees += 1;
        registration.attendees.push(userId);
    }
    const saved = await registration.save();

    res.status(200).json({message : "user successfully registered to event",
        registration: saved,
    });
  }catch (err){
    res.status(500).json({message: "error registering user",
        error: err.message,
    });
  }
});

router.get("/:eventId", async (req, res) => {
  const { eventId } = req.params;

  const registration = await EventRegistration.findOne({ eventId });

  if (!registration) {
    return res.json({
      registeredAttendees: 0,
      attendees: [],
    });
  }

  res.json(registration);
});


export default router;
