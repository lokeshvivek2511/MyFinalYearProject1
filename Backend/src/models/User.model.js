import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ---------------- AUTH ----------------
    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    // ---------------- ROLE ----------------
    role: {
      type: String,
      enum: ["farmer", "expert"],
      default: "farmer"
    },

    isExpertApproved: {
      type: Boolean,
      default: false
    },

    // ---------------- PROFILE ----------------
    name: {
      type: String,
      required: true
    },

    region: {
      state: String,
      district: String,
      village: String
    },

    // ---------------- BACKGROUND DETAILS ----------------
    background: {
      age: Number,
      landHolding: Number,
      income: Number,
      farmerType: String,
      category: String,
      gender: String
    },

    // ---------------- Q&A ----------------
    reputation: {
      type: Number,
      default: 0
    },

    questionsAsked: {
      type: Number,
      default: 0
    },

    answersGiven: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;