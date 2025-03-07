// user.models.js (ESM export)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "recruiter"],
    required: true,
  },
  profile: {
    bio: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
    },
    resume: {
      type: String,
      trim: true,
    },
    resumeOriginalName: {
      type: String,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
      default: "",
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
