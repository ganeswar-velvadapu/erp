const { pool } = require("../config/db");

const allCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses");
    const allCourses = result.rows;
    res.json({
      message: "All Courses",
      allCourses: allCourses,
    });
  } catch (error) {
    console.log("Error in fetching all courses", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

const myCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT registered_courses FROM students WHERE student_id = $1",
      [id]
    );
    const myCourses = result.rows;
    return res.json({
      message: "My Courses",
      myCourses: myCourses,
    });
  } catch (error) {
    console.log("Error in student my courses", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

const registerCourse = async (req, res) => {
  try {
    const { id, email, role } = req.user;
    const { courseID } = req.params;
    if (role != "student") {
      return res.json({
        message:  "Only students can register for this course",
      });
    }

    const course = await pool.query(
      "SELECT * FROM courses WHERE course_id = $1",
      [courseID]
    );

    if (course.rows.length == 0) {
      return res.json({
        message: "Course not found",
      });
    }

    const professor = await pool.query(
      "SELECT * FROM professors WHERE professor_id = $1",
      [course.rows[0].professor_id]
    );

    const student = await pool.query(
      "SELECT registered_courses FROM students WHERE student_id = $1",
      [id]
    );

    if (student.rowCount === 0) {
      return res.json({
        message: "Student not found.",
      });
    }

    const registeredCourses = student.rows[0].registered_courses || [];
    const isAlreadyRegistered = registeredCourses.some(
      (course) => course.course_id === courseID
    );

    if (isAlreadyRegistered) {
      return res.json({
        message: "You are already registered for this course.",
      });
    }

    registeredCourses.push({
      course_id: courseID,
      course_name: course.rows[0].course_name,
      slot: course.rows[0].slot,
      professor_id: course.rows[0].professor_id,
      professor_name: professor.rows[0].professor_name,
    });

    await pool.query(
      "UPDATE students SET registered_courses = $1 WHERE student_id = $2",
      [JSON.stringify(registeredCourses), id]
    );

    const registeredStudents = course.rows[0].registered_students || [];
    registeredStudents.push({
      student_id: id,
      student_email: email,
      grade: null,
      attendance: 0,
    });

    await pool.query(
      "UPDATE courses SET registered_students = $1 WHERE course_id = $2",
      [JSON.stringify(registeredStudents), courseID]
    );

    return res.json({
      message: "Course Registered Successfully",
      registeredCourses,
      courseDetails: {
        course_id: courseID,
        course_name: course.rows[0].course_name,
        registered_students: registeredStudents,
      },
    });
  } catch (error) {
    console.log("Error in registering courses", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

const deRegisterCourse = async (req, res) => {
  try {
    const { id, email, role } = req.user;
    const { courseID } = req.params;

    if (role != "student") {
      return res.json({
        message:
          "Only students can access registration and deregistration of courses",
      });
    }

    const student = await pool.query(
      "SELECT registered_courses FROM students WHERE student_id = $1",
      [id]
    );

    if (student.rowCount === 0) {
      return res.json({
        message: "Student not found.",
      });
    }

    const registeredCourses = student.rows[0].registered_courses || [];

    const isRegistered = registeredCourses.some(
      (course) => course.course_id === courseID
    );

    if (!isRegistered) {
      return res.json({
        message: `You are not registered for the course with ID ${courseID}.`,
      });
    }
    const updatedCourses = registeredCourses.filter(
      (course) => course.course_id !== courseID
    );

    await pool.query(
      "UPDATE students SET registered_courses = $1 WHERE student_id = $2",
      [JSON.stringify(updatedCourses), id]
    );
    const course = await pool.query(
      "SELECT registered_students FROM courses WHERE course_id = $1",
      [courseID]
    );

    if (course.rowCount === 0) {
      return res.json({
        message: "Course not found.",
      });
    }

    const registeredStudents = course.rows[0].registered_students || [];
    const updatedRegisteredStudents = registeredStudents.filter(
      (student) => student.student_id !== id
    );

    await pool.query(
      "UPDATE courses SET registered_students = $1 WHERE course_id = $2",
      [JSON.stringify(updatedRegisteredStudents), courseID]
    );
    return res.json({
      message: "Course deregistered successfully.",
      registeredCourses: updatedCourses,
    });
  } catch (error) {
    console.log("Error in deregistering courses", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};


const fetchGradesAndAttendance = async (req, res) => {
  try {
    const { id, role } = req.user; 

    if (role !== "student") {
      return res.json({
        message: "Only students can view their grades and attendance.",
      });
    }

    const courses = await pool.query(
      "SELECT course_id, course_name, registered_students FROM courses"
    );

    const gradesAndAttendance = [];

    courses.rows.forEach((course) => {
      const registeredStudents = course.registered_students || [];
      const studentDetails = registeredStudents.find(
        (student) => student.student_id === id
      );

      if (studentDetails) {
        gradesAndAttendance.push({
          course_id: course.course_id,
          course_name: course.course_name,
          grade: studentDetails.grade,
          attendance: studentDetails.attendance,
        });
      }
    });

    return res.json({
      message: "Grades and attendance fetched successfully.",
      gradesAndAttendance,
    });
  } catch (error) {
    console.log("Error in fetching grades and attendance", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};


module.exports = { allCourses, myCourses, registerCourse, deRegisterCourse,fetchGradesAndAttendance };
