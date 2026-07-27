const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const calculateResumeScore = require("./resumeScore");

const app = express();

const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../frontend")));

// ===============================
// Multer Configuration
// ===============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const uniqueName = Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const upload = multer({

    storage: storage,

    fileFilter: function (req, file, cb) {

        if (file.mimetype === "application/pdf") {

            cb(null, true);

        } else {

            cb(new Error("Only PDF files are allowed"));

        }

    }

});


// Request Logger
app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);
    next();

});



// Home Route
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "../frontend/login.html"));

});



// Test API Route
app.get("/api/message", (req, res) => {

    res.json({

        success: true,
        message: "Welcome to CareerCompass-AI Backend!",
        status: "Server working correctly"

    });

});




// Register Route
app.post("/register", (req, res) => {


    const {
        name,
        email,
        department,
        password
    } = req.body;



    if (!name || !email || !department || !password) {

        return res.status(400).json({

            success: false,
            message: "All fields are required"

        });

    }



    const sql = `
        INSERT INTO students
        (name, email, department, password)
        VALUES (?, ?, ?, ?)
    `;



    db.query(
        sql,
        [name, email, department, password],
        (err, result) => {


          if (err) {

    console.log(err);


    if (err.code === "ER_DUP_ENTRY") {

        return res.status(400).json({

            success: false,
            message: "Email already registered. Please login."

        });

    }


    return res.status(500).json({

        success: false,
        message: "Registration Failed"

    });

}



          // Create empty dashboard profile

const studentId = result.insertId;


const profileSql = `
    INSERT INTO student_profile
    (student_id, cgpa, skills, certificates, projects)
    VALUES (?, ?, ?, ?, ?)
`;


db.query(
    profileSql,
    [studentId, 0, 0, 0, 0],
    (profileErr) => {

        if (profileErr) {

            console.log(profileErr);

            return res.status(500).json({

                success: false,
                message: "Profile creation failed"

            });

        }


        res.json({

            success: true,
            message: "Registration Successful!"

        });


    }
);



        }
    );


});


// Login Route
app.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    // Check empty fields
    if (!email || !password) {

        return res.status(400).json({

            success: false,
            message: "Email and password are required"

        });

    }



    const sql = `
        SELECT * FROM students
        WHERE email = ?
    `;



    db.query(
        sql,
        [email],
        (err, result) => {


            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,
                    message: "Login Failed"

                });

            }



            // Check user exists

            if (result.length === 0) {

                return res.status(404).json({

                    success: false,
                    message: "Email not registered"

                });

            }



            const student = result[0];



            // Check password

            if (student.password !== password) {

                return res.status(401).json({

                    success: false,
                    message: "Invalid password"

                });

            }



            // Login success

            res.json({

                success: true,
                message: "Login Successful!",
                student: {

                    id: student.id,
                    name: student.name,
                    email: student.email,
                    department: student.department

                }

            });



        }
    );


});



// Get all students (Testing Database)
app.get("/students", (req, res) => {


    db.query(
        "SELECT * FROM students",
        (err, result) => {


            if (err) {

                return res.status(500).json(err);

            }


            res.json(result);


        }
    );


});





// Database Connection Test

db.query(
    "SELECT 1",
    (err, result) => {


        if (err) {

            console.log("❌ Database Connection Failed");
            console.log(err);

        }
        else {

            console.log("✅ MySQL Connected Successfully!");

        }


    }
);


// Get Student Dashboard Profile

app.get("/profile/:id", (req, res) => {

    const studentId = req.params.id;


    const sql = `
        SELECT 
            students.name,
            students.email,
            students.department,
            student_profile.cgpa,
            student_profile.skills,
            student_profile.certificates,
            student_profile.projects

        FROM students

        JOIN student_profile
        ON students.id = student_profile.student_id

        WHERE students.id = ?
    `;


    db.query(sql, [studentId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });

        }


        if (result.length === 0) {

            return res.status(404).json({
                message: "Profile not found"
            });

        }


        res.json(result[0]);

    });

});

// Get Full Student Profile
app.get("/student/:id", (req, res) => {

    const studentId = req.params.id;

    const sql = `
        SELECT
            students.id,
            students.name,
            students.email,
            students.department,
            students.college,
            students.year,
            student_profile.cgpa,
            student_profile.skills,
            student_profile.certificates,
            student_profile.projects

        FROM students

        LEFT JOIN student_profile
        ON students.id = student_profile.student_id

        WHERE students.id = ?
    `;

    db.query(sql, [studentId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student: result[0]
        });

    });

});


// =======================================
// Update Student Profile
// =======================================

app.put("/profile/:id", (req, res) => {

    const studentId = req.params.id;

    const {
        cgpa,
        skills,
        certificates,
        projects
    } = req.body;

    const sql = `
        UPDATE student_profile
        SET
            cgpa = ?,
            skills = ?,
            certificates = ?,
            projects = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [
            cgpa,
            skills,
            certificates,
            projects,
            studentId
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,
                    message: "Profile Update Failed"

                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,
                    message: "Profile not found"

                });

            }

            res.json({

                success: true,
                message: "Profile Updated Successfully"

            });

        }
    );

});

// =======================================
// CareerCompass-AI Skills Database
// =======================================

const skillsDatabase = {

    "Programming Languages": [
        "Java",
        "Core Java",
        "Advanced Java",
        "Java SE",
        "Java EE",
        "JDBC",
        "Python",
        "C",
        "C++",
        "C#",
        "JavaScript",
        "TypeScript",
        "PHP",
        "Go",
        "Kotlin",
        "Swift",
        "R",
        "Java core"
    ],

    "Web Development": [
        "HTML",
        "HTML5",
        "CSS",
        "CSS3",
        "Bootstrap",
        "Tailwind CSS",
        "JavaScript",
        "React",
        "Angular",
        "Vue.js",
        "Node.js",
        "Express.js",
        "Next.js",
        "REST API",
        "JSON",
        "AJAX"
    ],

    "Databases": [
        "SQL",
        "MySQL",
        "PostgreSQL",
        "Oracle",
        "SQLite",
        "MongoDB",
        "Firebase",
        "MariaDB"
    ],

    "Cloud & DevOps": [
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Git",
        "GitHub",
        "GitHub Actions",
        "CI/CD",
        "Linux",
        "Nginx"
    ],

    "Data Science & AI": [
        "Machine Learning",
        "Deep Learning",
        "Artificial Intelligence",
        "TensorFlow",
        "PyTorch",
        "Pandas",
        "NumPy",
        "OpenCV",
        "Scikit-learn",
        "NLP",
        "Data Analysis",
        "Data Visualization"
    ],

    "Mobile Development": [
        "Android",
        "Android Studio",
        "Flutter",
        "React Native",
        "Kotlin",
        "Swift",
        "Firebase"
    ],

    "Cyber Security": [
        "Ethical Hacking",
        "Cyber Security",
        "Penetration Testing",
        "Kali Linux",
        "OWASP",
        "Burp Suite",
        "Wireshark",
        "Nmap"
    ],

    "Tools": [
        "VS Code",
        "Visual Studio",
        "Eclipse",
        "IntelliJ IDEA",
        "NetBeans",
        "Postman",
        "Figma",
        "Canva",
        "Jira"
    ],

    "Soft Skills": [
        "Leadership",
        "Communication",
        "Teamwork",
        "Problem Solving",
        "Critical Thinking",
        "Time Management",
        "Adaptability",
        "Presentation"
    ]

};

// Upload Resume
app.post("/upload-resume", upload.single("resume"), async (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No resume uploaded"
        });

    }

    try {

        const pdfBuffer = fs.readFileSync(req.file.path);

        const pdfData = await pdfParse(pdfBuffer);
        console.log("Reached after PDF parsing");

        // =======================================
// Detect Skills from Resume
// =======================================

console.log("Starting skill detection...");
const resumeText = pdfData.text.toLowerCase();

const detectedSkills = {};


for (const category in skillsDatabase) {

    detectedSkills[category] = [];

    skillsDatabase[category].forEach(skill => {

  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");

if (regex.test(resumeText)) {
    detectedSkills[category].push(skill);
}
    });

}

// Calculate Resume Score AFTER skills detection
const resumeScore = calculateResumeScore(
    resumeText,
    detectedSkills
);


        console.log("Extracted Text:");
         console.log(pdfData.text);

         console.log("Detected Skills:");
console.log(detectedSkills);

     console.log("Resume Score:");
console.log(resumeScore);


       res.json({

    success: true,
    message: "Resume uploaded successfully!",
    file: req.file.filename,
    text: pdfData.text,
    skills: detectedSkills,
    resumeScore: resumeScore

});

} catch (error) {

    console.error("===== ERROR =====");
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
        success: false,
        message: "Unable to read PDF"
    });

}

});



// Start Server

app.listen(PORT, () => {

    console.log(`✅ Server Running on http://localhost:${PORT}`);

});