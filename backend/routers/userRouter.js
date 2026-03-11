import express from "express";
import Users from "../models/userModel.js";

const router = express.Router();

// POST /api/Users -> add a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new Users({
      firstName: req.body.fName,
      lastName: req.body.lName,
      username: req.body.username,
      email: req.body.email,
      studentId: req.body.stdNo,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role || "user" // Ensure the role is assigned here
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User Added Successfully", user: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Adding the User", error: err.message });
  }
});

export default router;
