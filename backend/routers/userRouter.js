import express from "express";
import Users from "../models/userModel.js";

const router = express.Router();

// POST /api/Users -> add a new user
router.post("/", async(req, res) => {
  try{
    const newUser = new Users({
      fName: req.body.fName,
      lName: req.body.lName,
      stdNo: req.body.stdNo, 
      email: req.body.email, 
      role: req.body.role,
      password: req.body.password,                                 
    });
    const savedUser = await newUser.save();
    res.status(201).json({message: "User Added Successfully ", Users: savedUser});
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message: "Error Adding the User", error: err.message});
  }
});

export default router;
