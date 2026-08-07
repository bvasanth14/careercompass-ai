// =====================================
// CareerCompass-AI JavaScript
// Version 2.0
// =====================================

// ===============================
// Navbar Scroll Effect
// ===============================

const navbar = document.querySelector(".navbar");

if (navbar) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.style.background = "#ffffff";
            navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
        } else {
            navbar.style.background = "";
            navbar.style.boxShadow = "none";
        }
    });
}


// ===============================
// Get Started Button
// ===============================

const getStartedButton = document.querySelector(".hero-buttons button");

if (getStartedButton) {
    getStartedButton.addEventListener("click", function () {
        alert("Welcome to CareerCompass-AI! 🚀\n\nYour AI career journey starts here.");
    });
}


// ===============================
// Explore Features Button
// ===============================

const exploreButton = document.querySelector(".secondary-btn");

if (exploreButton) {
    exploreButton.addEventListener("click", function () {
        const features = document.querySelector("#features");
        if (features) {
            features.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}


// ===============================
// Login Button
// ===============================

const loginButton = document.querySelector(".login-btn");

if (loginButton) {
    loginButton.addEventListener("click", function () {
        alert("Login system will be implemented in the next phase.");
    });
}


// ===============================
// Scroll Reveal Animation
// ===============================

const sections = document.querySelectorAll(
    ".feature-card, .stat-card, .steps div, .testimonial-card"
);

if (sections.length > 0) {
    sections.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(80px)";
        section.style.transition = "all 0.8s ease";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            } else {
                entry.target.style.opacity = "0";
                entry.target.style.transform = "translateY(80px)";
            }
        });
    }, {
        threshold: 0.15
    });

    sections.forEach((section) => {
        observer.observe(section);
    });
}


// ===============================
// Dark Mode Toggle
// ===============================

const themeButton = document.getElementById("theme-toggle");

if (themeButton) {
    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeButton.innerHTML = "☀️ Light Mode";
        } else {
            themeButton.innerHTML = "🌙 Dark Mode";
        }
    });
}

console.log("CareerCompass-AI JavaScript Loaded Successfully 🚀");


// =====================================
// Load Logged-In Student Details & Data
// =====================================

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    // If user is not logged in, force redirect to login page
    if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("register.html")) {
        window.location.href = "login.html";
    }
} else {
    // 1. Update Profile Header & Overview Text
    const studentNameElem = document.getElementById("student-name");
    if (studentNameElem) {
        studentNameElem.innerText = student.name;
    }

    const profileNameElem = document.getElementById("profile-name");
    if (profileNameElem) {
        profileNameElem.innerText = student.name;
    }

    const profileDeptElem = document.getElementById("profile-dept");
    if (profileDeptElem && student.department) {
        profileDeptElem.innerText = student.department;
    }

    // 2. Generate Initials (e.g. "Daniyal A" -> "DA")
    const profileInitialsElem = document.getElementById("profile-initials");
    if (profileInitialsElem && student.name) {
        let initials = student.name
            .trim()
            .split(/\s+/)
            .map(word => word[0])
            .join("")
            .toUpperCase();

        profileInitialsElem.innerText = initials;
    }

    // 3. Fetch Dashboard Stats from Backend (http://localhost:5000/profile/:id)
    fetch(`http://localhost:5000/profile/${student.id}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log("Profile info response:", data.message);
                return;
            }

            // Update stats dynamically from DB
            const cgpaElem = document.getElementById("cgpa");
            if (cgpaElem) cgpaElem.innerText = data.cgpa !== undefined ? data.cgpa : "0.00";

            const skillsElem = document.getElementById("skills");
            if (skillsElem) skillsElem.innerText = data.skills !== undefined ? data.skills : "0";

            const certsElem = document.getElementById("certificates");
            if (certsElem) certsElem.innerText = data.certificates !== undefined ? data.certificates : "0";

            const projectsElem = document.getElementById("projects");
            if (projectsElem) projectsElem.innerText = data.projects !== undefined ? data.projects : "0";

            if (profileDeptElem && data.department) {
                profileDeptElem.innerText = data.department;
            }
        })
        .catch(error => {
            console.log("Dashboard data fetch error:", error);
        });
}


// ===============================
// Logout Button Handler
// ===============================

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("student");
        window.location.href = "login.html";
    });
}