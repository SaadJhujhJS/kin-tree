const express = require("express");

const {createFamilyMember, getFamilyMembers, getFamilyMember, updateFamilyMember, deleteFamilyMember} = require("../controllers/familyMemberController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFamilyMember);
router.get("/tree/:familyTreeId", protect, getFamilyMembers);

router.get("/:id", protect, getFamilyMember);

router.put("/:id", protect, updateFamilyMember);
router.delete("/:id", protect, deleteFamilyMember);

module.exports = router;