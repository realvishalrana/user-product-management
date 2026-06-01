import mongoose from "mongoose";

const useSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", useSchema);

export default User;
