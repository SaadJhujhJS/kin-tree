const express = require("express");

const {
  createFamilyTree,
  getFamilyTrees,
} = require("../controllers/familyTreeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFamilyTree);
router.get("/", protect, getFamilyTrees);

module.exports = router;