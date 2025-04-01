import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minLength:8, maxLength: 16},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true , minLength:8, maxLength:16},
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
);

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
export default User;
