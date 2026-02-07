import express from "express";
import Users from "../models/userModel.js";

const router = express.Router();

// POST /api/login -> login authentication
router.post("/", async(req, res) => {
  try{
    const {email, password} = req.body;

    const user = await Users.findOne({email});
    if(!user)
    {
        return res.status(404).json({message: "Email Invalid"})
    }
    if(user.password != password)
    {
        return res.status(404).json({message: "Password Invalid"})
    }

    res.status(201).json({message: "Login Successful "});
    console.log(`User logged in: ${user.email}`);

  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message: "Error Loggining in", error: err.message});
  }
});

export default router;