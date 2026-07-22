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