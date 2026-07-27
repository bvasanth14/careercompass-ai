console.log("resume.js started");

const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.onclick = async () => {

    const file = document.getElementById("resume").files[0];

    if (!file) {
        alert("Please select a PDF.");
        return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {

        const response = await fetch("/upload-resume", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        document.getElementById("analysis-result").innerHTML = `
            <h2>✅ Resume Uploaded Successfully</h2>

            <p><strong>File:</strong> ${data.file}</p>

            <hr>

            <h3>📄 Extracted Resume Text</h3>

            <pre style="white-space: pre-wrap;">${data.text}</pre>
        `;

    } catch (err) {

        console.error(err);

        document.getElementById("analysis-result").innerHTML = `
            <h2 style="color:red;">❌ Error</h2>
            <p>${err.message}</p>
        `;
    }

};