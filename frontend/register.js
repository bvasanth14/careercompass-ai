const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

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
})
.catch(error => {
    console.error(error);
});

});