// =====================================
// CareerCompass-AI JavaScript
// Version 1.0
// =====================================



// Navbar scroll effect

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");


    if (window.scrollY > 50) {

        navbar.style.background = "#ffffff";
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";

    } 
    else {

        navbar.style.boxShadow = "none";

    }

});





// Get Started Button

const getStartedButton = document.querySelector(".hero-buttons button");


getStartedButton.addEventListener("click", function () {


    alert(
        "Welcome to CareerCompass-AI! 🚀\n\nYour AI career journey starts here."
    );


});





// Explore Features Button

const exploreButton = document.querySelector(".secondary-btn");


exploreButton.addEventListener("click", function () {


    document
    .querySelector("#features")
    .scrollIntoView({

        behavior:"smooth"

    });


});





// Login Button

const loginButton = document.querySelector(".login-btn");


loginButton.addEventListener("click", function () {


    alert(
        "Login system will be implemented in the next phase."
    );


});




// Scroll Reveal Animation


const sections = document.querySelectorAll(
    ".feature-card, .stat-card, .steps div, .testimonial-card"
);


sections.forEach((section) => {

    section.style.opacity = "0";
    section.style.transform = "translateY(80px)";
    section.style.transition = "all 0.8s ease";

});


const observer = new IntersectionObserver((entries) => {


    entries.forEach((entry) => {


        if(entry.isIntersecting) {

            // Show animation

            entry.target.style.opacity = "1";

            entry.target.style.transform =
            "translateY(0)";

        } 
        
        else {

            // Reset when leaving screen

            entry.target.style.opacity = "0";

            entry.target.style.transform =
            "translateY(80px)";

        }


    });


}, 
{
    threshold: 0.15
});



sections.forEach((section)=>{

    observer.observe(section);

});