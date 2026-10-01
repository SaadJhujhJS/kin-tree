const express = require("express");

const {
  createFamilyTree,
  getFamilyTrees,
  getFamilyTreeData,
} = require("../controllers/familyTreeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFamilyTree);
router.get("/", protect, getFamilyTrees);
router.get("/:id/data", protect, getFamilyTreeData);


module.exports = router;