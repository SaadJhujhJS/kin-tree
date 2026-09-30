const Relationship = require("../models/Relationship");
const FamilyMember = require("../models/FamilyMember");
const FamilyTree = require("../models/FamilyTree");

const createRelationship = async (req, res) => {
  try {
    const { familyTreeId, from, to, type } = req.body;

    if (!familyTreeId || !from || !to || !type) {
      return res.status(400).json({
        message: "Family tree, from, to and relationship type are required",
      });
    }

    if (from === to) {
      return res.status(400).json({
        message: "A person cannot have a relationship with themselves",
      });
    }

    // Check family tree ownership
    const familyTree = await FamilyTree.findOne({
      _id: familyTreeId,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(404).json({
        message: "Family tree not found",
      });
    }

    // Check both members belong to this family tree
    const members = await FamilyMember.find({
      _id: { $in: [from, to] },
      familyTree: familyTreeId,
    });

    if (members.length !== 2) {
      return res.status(400).json({
        message: "Both members must belong to this family tree",
      });
    }

    // Check if relationship already exists
    const existingRelationship = await Relationship.findOne({
      familyTree: familyTreeId,
      from,
      to,
      type,
    });

    if (existingRelationship) {
      return res.status(400).json({
        message: "This relationship already exists",
      });
    }

    const relationship = await Relationship.create({
      familyTree: familyTreeId,
      from,
      to,
      type,
    });

    res.status(201).json({
      message: "Relationship created successfully",
      relationship,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createRelationship,
};