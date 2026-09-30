const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema(
  {
    familyTree: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyTree",
      required: true,
    },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "father",
        "mother",
        "son",
        "daughter",
        "husband",
        "wife",
        "brother",
        "sister",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Relationship", relationshipSchema);