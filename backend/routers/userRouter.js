import express from "express";
import Users from "../models/userModel.js";

const router = express.Router();

// GET /api/users  → get all users (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET /api/users/:id → get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// UPDATE user role
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating role" });
  }
});

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
      role: req.body.role || "user"
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User Added Successfully", user: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Adding the User", error: err.message });
  }
});

// DELETE /api/users/:id → delete user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await Users.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;