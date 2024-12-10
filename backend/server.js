const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const studentRoutes = require("./routes/student");
const professorRoutes = require("./routes/professor")

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/professor",professorRoutes)


//Server setup
app.listen(PORT, () => {
  try {
    console.log(`Server listening on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
