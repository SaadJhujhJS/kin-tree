const FamilyTree = require("../models/FamilyTree");

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

module.exports = {
  createFamilyTree,
  getFamilyTrees,
};