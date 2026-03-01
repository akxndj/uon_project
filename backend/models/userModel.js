import mongoose from "mongoose";

const userSchema = new mongoose.Schema({firstName: {type: String, required: true},
                                        lastName: {type: String, required: true}, 
                                        username: {type: String, required: true},
                                        email: {type: String, required: true},
                                        studentId: {type: String, required: true},
                                        phone: {type: Number, required: true}, 
                                        role: {type: String, required: true},
                                        password: {type: String, required: true}
                                    }, {collection: "Users"});
export default mongoose.model("Users", userSchema);