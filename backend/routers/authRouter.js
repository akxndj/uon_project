import express from "express";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

// POST /api/login -> login authentication
router.post("/", async(req, res) => {
  try{
    const {email, password} = req.body;

    const user = await Users.findOne({email});
    const match = await bcrypt.compare(password, user.password);
    if(!user)
    {
        return res.status(404).json({message: "Email Invalid"})
    }
    if(!match)
    {
        return res.status(404).json({message: "Password Invalid"})
    }

    res.status(201).json({
  message: "Login Successful",
  user: {
    id: user._id,
    email: user.email,
    role: user.role,
    studentId: user.studentId
  }
});
    console.log(`User logged in: ${user.email}, ${user.studentId}`);

  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message: "Error Loggining in", error: err.message});
  }
});

export default router;