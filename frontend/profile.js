const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    window.location.href = "login.html";
}

fetch(`http://localhost:5000/student/${student.id}`)
.then(response => response.json())
.then(data => {

    const profile = data.student;

    document.getElementById("name").value = profile.name || "";
    document.getElementById("email").value = profile.email || "";
    document.getElementById("department").value = profile.department || "";
    document.getElementById("cgpa").value = profile.cgpa ?? 0;
    document.getElementById("skills").value = profile.skills ?? 0;
    document.getElementById("certificates").value = profile.certificates ?? 0;
    document.getElementById("projects").value = profile.projects ?? 0;

})
.catch(error => {
    console.log(error);
});

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("student");
        window.location.href = "login.html";
    });
}

// ================================
// Save Profile Changes
// ================================

const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const student = JSON.parse(localStorage.getItem("student"));

    const profileData = {

        cgpa: document.getElementById("cgpa").value,
        skills: document.getElementById("skills").value,
        certificates: document.getElementById("certificates").value,
        projects: document.getElementById("projects").value

    };

    try {

        const response = await fetch(`http://localhost:5000/profile/${student.id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(profileData)

        });

        const data = await response.json();

        alert(data.message);

    }

    catch (error) {

        console.log(error);

        alert("Cannot connect to server");

    }

});