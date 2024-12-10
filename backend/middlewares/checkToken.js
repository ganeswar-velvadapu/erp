const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const checkToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ message: "Please Login" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.json({
                message: "Invalid or expired token. Please log in."
            });
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    } catch (error) {
        console.error("Error in token verification:", error);
        return res.json({ message: "Internal Server Error" });
    }
};

module.exports = { checkToken };
