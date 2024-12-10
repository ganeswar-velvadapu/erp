const express = require("express");
const {
  allCourses,
  myCourses,
  registerCourse,
  deRegisterCourse,
  fetchGradesAndAttendance,
} = require("../controllers/student");
const { checkToken } = require("../middlewares/checkToken");
const router = express.Router();

router.get("/allCourses", checkToken, allCourses);
router.get("/myCourses/:id", checkToken, myCourses);
router.post("/registerCourse/:courseID", checkToken, registerCourse);
router.delete("/deregisterCourse/:courseID", checkToken, deRegisterCourse);
router.get("/fetchGrades",checkToken,fetchGradesAndAttendance)


module.exports = router;
