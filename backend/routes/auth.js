const express = require("express")
const { logout, student_signup, student_login, prof_signup, prof_login } = require("../controllers/auth")

const router = express.Router()

router.post("/student/signup",student_signup)
router.post("/student/login",student_login)
router.post("/professor/signup",prof_signup)
router.post("/professor/login",prof_login)
router.get("/logout",logout)
module.exports = router