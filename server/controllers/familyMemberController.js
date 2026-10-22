const FamilyMember = require("../models/FamilyMember");
const FamilyTree = require("../models/FamilyTree");
const Relationship = require("../models/Relationship");
const cloudinary = require('../config/cloudinary');

const createFamilyMember = async (req, res) => {
  try {
    const {
      name,
      gender,
      dateOfBirth,
      dateOfDeath,
      email,
      phone,
      bio,
      familyTreeId,
    } = req.body;

    if (!name || !gender || !familyTreeId) {
      return res.status(400).json({
        message: "Name, gender and family tree are required",
      });
    }

    // Check that the family tree belongs to logged-in user
    const familyTree = await FamilyTree.findOne({
      _id: familyTreeId,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(404).json({
        message: "Family tree not found",
      });
    }

    let profilePhotoUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePhotoUrl = result.secure_url;
    }

    const familyMember = await FamilyMember.create({
      familyTree: familyTreeId,
      name,
      profilePhotoUrl,
      gender,
      dateOfBirth,
      dateOfDeath,
      email,
      phone,
      bio,
    });



    res.status(201).json({
      message: "Family member created successfully",
      familyMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getFamilyMembers = async (req, res) => {
  try {
    const { familyTreeId } = req.params;

    // Check that the family tree belongs to logged-in user
    const familyTree = await FamilyTree.findOne({
      _id: familyTreeId,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(404).json({
        message: "Family tree not found",
      });
    }

    const familyMembers = await FamilyMember.find({
      familyTree: familyTreeId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      familyMembers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const familyMember = await FamilyMember.findById(id);

    if (!familyMember) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    // Check that the family tree belongs to logged-in user
    const familyTree = await FamilyTree.findOne({
      _id: familyMember.familyTree,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(403).json({
        message: "You are not authorized to view this member",
      });
    }

    res.status(200).json({
      familyMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const familyMember = await FamilyMember.findById(id);

    if (!familyMember) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    // Check that the family tree belongs to logged-in user
    const familyTree = await FamilyTree.findOne({
      _id: familyMember.familyTree,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(403).json({
        message: "You are not authorized to update this member",
      });
    }

    const {
      name,
      gender,
      dateOfBirth,
      dateOfDeath,
      email,
      phone,
      bio,
    } = req.body;

    familyMember.name = name ?? familyMember.name;
    familyMember.gender = gender ?? familyMember.gender;
    familyMember.dateOfBirth = dateOfBirth ?? familyMember.dateOfBirth;
    familyMember.dateOfDeath = dateOfDeath ?? familyMember.dateOfDeath;
    familyMember.email = email ?? familyMember.email;
    familyMember.phone = phone ?? familyMember.phone;
    familyMember.bio = bio ?? familyMember.bio;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      familyMember.profilePhotoUrl = result.secure_url;
    }

    await familyMember.save();

    res.status(200).json({
      message: "Family member updated successfully",
      familyMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const familyMember = await FamilyMember.findById(id);

    if (!familyMember) {
      return res.status(404).json({
        message: "Family member not found",
      });
    }

    const familyTree = await FamilyTree.findOne({
      _id: familyMember.familyTree,
      owner: req.userId,
    });

    if (!familyTree) {
      return res.status(403).json({
        message: "You are not authorized to delete this family member",
      });
    }

    // Delete relationships connected to this member
    await Relationship.deleteMany({
      $or: [
        { from: id },
        { to: id },
      ],
    });

    // Delete the family member
    await FamilyMember.findByIdAndDelete(id);

    res.status(200).json({
      message: "Family member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createFamilyMember,
  getFamilyMembers,
  getFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
};