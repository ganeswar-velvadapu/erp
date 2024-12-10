const dotenv = require("dotenv");
dotenv.config();
const { pool } = require("../config/db");

// Everyone
const getCourse = async (req, res) => {
  try {
    const { courseID } = req.params;
    const result = await pool.query(
      "SELECT * from courses WHERE course_id = ($1)",
      [courseID]
    );
    if (result.rows.length == 0) {
      return res.json({
        message: "Course not found",
      });
    }
    const courseDetails = result.rows[0];
    return res.json({
      message: "Course fetching Sucessfull",
      courseDetails,
    });
  } catch (error) {
    console.log("Error in getting the course", error);
    return res.json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCourse,
};
