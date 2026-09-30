const express = require("express");
const {createRelationship,} = require("../controllers/relationshipController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRelationship);

module.exports = router;