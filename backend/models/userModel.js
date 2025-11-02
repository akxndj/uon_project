import mongoose from "mongoose";

const userSchema = new mongoose.Schema({fName: {type: String, required: true},
                                        lName: {type: String, required: true}, 
                                        stdNo: {type: String, required: true}, 
                                        email: {type: String, required: true},
                                        role: {type: String, required: true},
                                        password: {type: String, required: true}
                                    }, {collection: "Users"});
export default mongoose.model("Users", userSchema);