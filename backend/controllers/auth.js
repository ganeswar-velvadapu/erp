const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");

const student_signup = async (req, res) => {
    try {
        const { student_name, email, password } = req.body;
        
        if (!student_name || !email || !password) {
            return res.json({
                message: "All fields are required"
            });
        }

        const user = await pool.query("SELECT * FROM students WHERE student_email = ($1)", [email]);
        const existingUser = user.rows[0];
        if (existingUser) {
            return res.json({
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await pool.query("INSERT INTO students(student_name, student_email, student_password) VALUES($1, $2, $3) RETURNING student_name, student_email", [student_name, email, hashPassword]);
        const createdStudent = result.rows[0];

        return res.json({
            message: "SignUp Successful",
            createdStudent
        });
    } catch (error) {
        console.log("Error in student signup:", error);
        return res.json({
            message: "Internal Server Error"
        });
    }
};

const student_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.json({
                message: "Email and password are required"
            });
        }

        const result = await pool.query("SELECT * FROM students WHERE student_email = ($1)", [email]);
        const existingUser = result.rows[0];
        if (!existingUser) {
            return res.json({
                message: "User does not exist"
            });
        }

        const checkPassword = await bcrypt.compare(password, existingUser.student_password);
        if (!checkPassword) {
            return res.json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign({
            id:existingUser.student_id,
            email: existingUser.student_email,
            role: existingUser.role  
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 3600000 
        });

        return res.json({
            message: "Login successful",
            role: existingUser.role,
            student_name: existingUser.student_name,
            student_email: existingUser.student_email,
        });
    } catch (error) {
        console.log("Error in student login:", error);
        return res.json({
            message: "Internal Server Error"
        });
    }
};

const prof_signup = async (req, res) => {
    try {
        const { professor_name, email, password } = req.body;
        
        if (!professor_name || !email || !password) {
            return res.json({
                message: "All fields are required"
            });
        }

        const user = await pool.query("SELECT * FROM professors WHERE professor_email = ($1)", [email]);
        const existingUser = user.rows[0];
        if (existingUser) {
            return res.json({
                message: "Professor already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO professors(professor_name, professor_email, professor_password) VALUES($1, $2, $3) RETURNING professor_name, professor_email",
            [professor_name, email, hashPassword]
        );
        const createdProfessor = result.rows[0];

        return res.json({
            message: "SignUp Successful",
            createdProfessor
        });
    } catch (error) {
        console.log("Error in professor signup:", error);
        return res.json({
            message: "Internal Server Error"
        });
    }
};

const prof_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.json({
                message: "Email and password are required"
            });
        }

        const result = await pool.query("SELECT * FROM professors WHERE professor_email = ($1)", [email]);
        const existingUser = result.rows[0];
        if (!existingUser) {
            return res.json({
                message: "Professor does not exist"
            });
        }

        const checkPassword = await bcrypt.compare(password, existingUser.professor_password);
        if (!checkPassword) {
            return res.json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign({
            role: existingUser.role, 
            id: existingUser.professor_id,
            email: existingUser.professor_email
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 3600000 
        });

        return res.json({
            message: "Login successful",
            professor_id: existingUser.professor_id,
            professor_name: existingUser.professor_name,
            professor_email: existingUser.professor_email
        });
    } catch (error) {
        console.log("Error in professor login:", error);
        return res.json({
            message: "Internal Server Error"
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Logout Successful"
    });
};


module.exports = { student_login, student_signup, prof_signup, logout, prof_login };
