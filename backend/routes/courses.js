const express = require("express");
const { getCourse } = require("../controllers/courses");
const { checkToken } = require("../middlewares/checkToken");
const router = express.Router();

router.get("/:courseID", checkToken, getCourse);

module.exports = router;

