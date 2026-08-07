document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Could not find 'registerForm' element in HTML!");
        return;
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const department = document.getElementById("department").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Optional: Check if passwords match before sending
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                department,
                password
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                // Optionally redirect to login page after successful registration
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.error("Error during registration:", error);
        });
    });
});