const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Request Logger
app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);
    next();

});



// Home Route
app.get("/", (req, res) => {

    res.send("🚀 CareerCompass-AI Backend is Running Successfully!");

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



            res.json({

                success: true,
                message: "Registration Successful!"

            });



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


// 404 Route

app.use((req, res) => {

    res.status(404).json({

        success:false,
        message:"Route not found"

    });

});






// Start Server

app.listen(PORT, () => {

    console.log(`✅ Server Running on http://localhost:${PORT}`);

});