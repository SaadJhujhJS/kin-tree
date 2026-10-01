const express = require("express");
const {createRelationship, deleteRelationship, getRelationships} = require("../controllers/relationshipController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRelationship);
router.get("/tree/:familyTreeId", protect, getRelationships);
router.delete("/:id", protect, deleteRelationship);

module.exports = router;