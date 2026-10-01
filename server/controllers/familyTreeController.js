const FamilyTree = require("../models/FamilyTree");
const FamilyMember = require("../models/FamilyMember");
const Relationship = require("../models/Relationship");

const createFamilyTree = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Family tree name is required",
      });
    }

    const familyTree = await FamilyTree.create({
      name,
      owner: req.userId,
    });

    res.status(201).json({
      message: "Family tree created successfully",
      familyTree,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getFamilyTrees = async (req, res) => {
  try {
    const familyTrees = await FamilyTree.find({
      owner: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      familyTrees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getFamilyTreeData = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the family tree belongs to the logged-in user
    const familyTree = await FamilyTree.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(404).json({
        message: "Family tree not found",
      });
    }

    // Get all family members
    const familyMembers = await FamilyMember.find({
      familyTree: id,
    }).sort({ createdAt: 1 });

    // Get all relationships
    const relationships = await Relationship.find({
      familyTree: id,
    })
      .populate("from", "name gender profilePhoto")
      .populate("to", "name gender profilePhoto");

    res.status(200).json({
      familyTree,
      familyMembers,
      relationships,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createFamilyTree,
  getFamilyTrees,
  getFamilyTreeData,
};