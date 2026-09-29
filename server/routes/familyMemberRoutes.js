const express = require("express");

const {createFamilyMember, getFamilyMembers, getFamilyMember} = require("../controllers/familyMemberController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFamilyMember);
router.get("/tree/:familyTreeId", protect, getFamilyMembers);

router.get("/:id", protect, getFamilyMember);

module.exports = router;