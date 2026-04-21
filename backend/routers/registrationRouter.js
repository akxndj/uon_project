import express from "express";
import EventRegistration from "../models/registrationModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { eventId, userId, email, role } = req.body;

    let registration = await EventRegistration.findOne({ eventId });
    const event = await Event.findById(eventId);

    console.log(event);

    if (!registration) {
      registration = new EventRegistration({
        eventId,
        registeredAttendees: 1,
        attendees: [{ studentId: userId, email, role }],
      });
      event.registered +=1;
    } else {
      const alreadyRegistered = registration.attendees.some(
        (att) => att.studentId === userId
      );

      if (alreadyRegistered) {
        return res
          .status(400)
          .json({ message: "User already registered" });
      }

      registration.registeredAttendees += 1;
      event.registered += 1;
      registration.attendees.push({
        studentId: userId,
        email,
        role,
      });
    }
    
    const saved = await registration.save();
    await event.save();

    res.status(200).json({
      message: "User successfully registered to event",
      registration: saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error registering user",
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

//get all registrations

router.get("/", async (req, res) => {
  try {
    const registrations = await EventRegistration.find().populate("eventId");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching registrations",
      error: err.message,
    });
  }
});

router.post("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    let registration = await EventRegistration.findOne({ eventId });

    if (!registration) {
      return res.status(400).json({ message: "Event not found" });
    }

    
    const isRegistered = registration.attendees.some(
    (att) => att.studentId === userId
    );

    if (!isRegistered) {
      return res.status(400).json({ message: "user already unregistered" });
    }

    registration.attendees = registration.attendees.filter(
      (att) => att.studentId !== userId
    );

    registration.registeredAttendees -= 1;

    const saved = await registration.save();

    res.status(200).json({
      message: "user successfully unregistered from event",
      registration: saved,
    });
  } catch (err) {
    res.status(500).json({
      message: "error unregistering user",
      error: err.message,
    });
  }
});

router.post("/:eventId/email", async(req, res) =>
  {
    try{
      const { eventId } = req.params;
      const {subject, message} = req.body;

      let registration = await EventRegistration.findOne({eventId});

      if(!registration)
      {
        return res.status(404).json("No registrations found");
      }
      const emails = registration.attendees.map((att) => att.email);
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      })
       const info = await transporter.sendMail({
        from: '"Event Platform " <no-reply@test.com>',
        to: '"All Recipients" <no-reply@test.com>',
        bcc: emails.join(","),
        subject: subject,
        text: message,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);

      console.log("Email preview:", previewUrl);

      res.json({
        message: "Emails sent (dev mode)",
        previewUrl,
      });
      
    }
    catch(err){
      console.error(err);
      return res.status(500).json({message: "Failed to send email", error: err.message});
    }
  });
  router.post("/:eventId/emailOrg", async(req, res) =>
  {
    try{
      const { eventId } = req.params;
      const {subject, message} = req.body;
      // use eventid to find created by
      // get email from user using createdby id
      const event = await Event.findById(eventId);
      if(!event)
      {
        return res.status(404).json({message: "no event found"});
      }
      const user = await User.findById(event.createdBy);
      if(!user)
      {
        return res.status(404).json({message: "no user found"});
      }
      const email = user.email;
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      })
       const info = await transporter.sendMail({
        from: '"Event Platform " <no-reply@test.com>',
        to: email,
        subject: subject,
        text: message,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);

      console.log("Email preview:", previewUrl);

      res.json({
        message: "Emails sent (dev mode)",
        previewUrl,
      });
      
    }
    catch(err){
      console.error(err);
      return res.status(500).json({message: "Failed to send email", error: err.message});
    }
  });


export default router;