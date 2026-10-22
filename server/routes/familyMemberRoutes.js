const express = require("express");

const {createFamilyMember, getFamilyMembers, getFamilyMember, updateFamilyMember, deleteFamilyMember} = require("../controllers/familyMemberController");

const protect = require("../middleware/authMiddleware");

const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

const router = express.Router();

router.post("/", protect, upload.single('profilePhoto'), createFamilyMember);
router.get("/tree/:familyTreeId", protect, getFamilyMembers);

router.get("/:id", protect, getFamilyMember);

router.put("/:id", protect, upload.single('profilePhoto'), updateFamilyMember);
router.delete("/:id", protect, deleteFamilyMember);

module.exports = router;