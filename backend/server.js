import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routers/eventRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI) .then(() => console.log("database connected successfully"))
                                        .catch(err => console.error("could not connect to db", err));

app.use("/api/events", router);
const port = process.env.port;
app.listen(port, () => console.log("server running"));