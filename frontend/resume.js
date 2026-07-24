const resumeForm = document.getElementById("resumeForm");

resumeForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const fileInput = document.getElementById("resume");

    const file = fileInput.files[0];

    if (!file) {

        alert("Please select a resume.");

        return;

    }

    if (file.type !== "application/pdf") {

        alert("Only PDF files are allowed.");

        return;

    }

    alert("Resume selected successfully!");

});