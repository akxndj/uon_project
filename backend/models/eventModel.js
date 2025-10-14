import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({name: {type: String, required: true},
                                        eventId: {type: String, required: true}, 
                                        date: {type: Date, required: true}, 
                                        location: {type: String, required: true},
                                        description: {type: String, required: true},
                                        eligibility: {type: String, required: true},
                                        fee: {type: Number, default: 0},
                                        included: {type: String, required: false},
                                        image: String,
                                        createdBy: {type: String, required: true}
                                    }, {collection: "Events"});
export default mongoose.model("Event", eventSchema);