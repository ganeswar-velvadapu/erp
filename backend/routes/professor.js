const express = require("express");
const {
  addCourse,
  updateCourse,
  deleteCourse,
  updateStudentStatus,
} = require("../controllers/professor");
const { checkToken } = require("../middlewares/checkToken");
const { allCourses } = require("../controllers/student");
const router = express.Router();


router.get("/allCourses", checkToken, allCourses);
router.post("/addCourse", checkToken, addCourse);
router.put("/updateCourse/:updationCourse", checkToken, updateCourse);
router.delete("/deleteCourse/:courseID", checkToken, deleteCourse);
router.post("/updateStudentStatus/:courseID",checkToken,updateStudentStatus)
module.exports = router;
