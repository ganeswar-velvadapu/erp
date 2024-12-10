const dotenv = require("dotenv");
dotenv.config();
const { pool } = require("../config/db");

//Professor and Admin
const addCourse = async (req, res) => {
  try {
    const { id, email, role } = req.user;
    if (role != "professor") {
      return res.json({
        message: "You are not authorized to add a course",
      });
    }
    const { courseName, courseID, slot } = req.body;

    if (!courseName || !courseID || !slot) {
      return res.json({
        message: "Enter all details",
      });
    }

    const existingCourse = await pool.query(
      "SELECT * FROM courses WHERE course_id= ($1)",
      [courseID]
    );

    if (existingCourse.rows.length > 0) {
      return res.json({
        message:
          "Course already added, choose a unique course number to continue forward",
      });
    }

    const result = await pool.query(
      "INSERT INTO courses(course_name,course_id,slot,professor_id) VALUES($1,$2,$3,$4) RETURNING *",
      [courseName, courseID, slot, id]
    );
    const createdCourse = result.rows[0];
    return res.json({
      message: "Course Added Succesfully",
      createdCourse,
    });
  } catch (error) {
    console.log("Error in addition of course", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};
const updateCourse = async (req, res) => {
  try {
    const { id, email, role } = req.user;
    const { updationCourse } = req.params;
    const { courseName, slot } = req.body;

    if (role != "professor") {
      return res.json({
        message: "You are not authorized to update a course",
      });
    }

    const existingCourse = await pool.query(
      "SELECT * FROM courses WHERE course_id = $1",
      [updationCourse]
    );

    if (existingCourse.rows.length == 0) {
      return res.json({
        message: "Course not found",
      });
    }

    const result = await pool.query(
      "UPDATE courses SET course_name = $1, slot = $2 WHERE course_id = $3 AND professor_id = $4 RETURNING *",
      [courseName, slot, updationCourse, id]
    );

    const updatedCourse = result.rows[0];

    if (!updatedCourse) {
      return res.json({
        message:
          "Failed to update the course. Ensure you are the owner of this course.",
      });
    }
    return res.json({
      message: "Course Updated Successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log("Error in updating the course", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    let { id, email, role } = req.user;

    if (role != "professor") {
      return res.json({
        message: "You are not allowed to delete a course",
      });
    }

    let { courseID } = req.params;
    const result = await pool.query(
      "DELETE FROM courses WHERE course_id = ($1) AND professor_id = ($2) RETURNING *",
      [courseID, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message:
          "Failed to delete the course. Ensure that the course exists and you are the owner.",
      });
    }
    return res.json({
      message: `Course with courseID ${courseID} deleted successfully`,
      deletedCourse: result.rows[0],
    });
  } catch (error) {
    console.log("Error in deleting a course", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

//Update student status
const updateStudentStatus = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { courseID } = req.params;
    const { studentID, grade, attendance_percentage } = req.body;

    if (role != "professor") {
      return res.json({
        message: "Only valid professor can update the student's status",
      });
    }

    const course = await pool.query(
      "SELECT * FROM courses WHERE course_id = $1 AND professor_id = $2",
      [courseID, id]
    );

    if (course.rows.length == 0) {
      return res.json({
        message: "Course not found or you are not the owner of this course",
      });
    }

    const registeredStudents = course.rows[0].registered_students;

    const studentIndex = registeredStudents.findIndex(
      (student) => student.student_id === studentID
    );

    if (studentIndex === -1) {
      return res.json({
        message: "Student not found",
      });
    }

    registeredStudents[studentIndex].grade = grade;
    registeredStudents[studentIndex].attendance =
      attendance_percentage;

    await pool.query(
      "UPDATE courses SET registered_students = $1 WHERE course_id = $2",
      [JSON.stringify(registeredStudents), courseID]
    );

    return res.json({
      message: "Student details updated successfully.",
      registered_students: registeredStudents,
    });
  } catch (error) {
    console.log("Error in updating student status", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { addCourse, deleteCourse, updateCourse, updateStudentStatus };
