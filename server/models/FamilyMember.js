const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
  {
    familyTree: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyTree",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    profilePhotoUrl: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
    },

    dateOfDeath: {
      type: Date,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FamilyMember", familyMemberSchema);