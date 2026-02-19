import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({eventId: {type: String, required: true, unique: true}, 
                                        registeredAttendees: {type: Number, default: 0},
                                        attendees: {type: [String]}
                                    }, {collection: "EventRegistration"});
export default mongoose.model("EventRegistration", registrationSchema);