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

      let skillsHTML = "";

for (const category in data.skills) {

    if (data.skills[category].length > 0) {

        skillsHTML += `
            <h3>${category}</h3>

            <ul>
                ${data.skills[category]
                .map(skill => `<li>✅ ${skill}</li>`)
                .join("")}
            </ul>
        `;
    }

}


document.getElementById("analysis-result").innerHTML = `

    <h2>✅ Resume Uploaded Successfully</h2>

    <p><strong>File:</strong> ${data.file}</p>


    <hr>


    <h2>🎯 Skills Detected</h2>

    ${skillsHTML}


    <hr>


    <details>

        <summary>
            📄 View Extracted Resume Text
        </summary>


        <pre style="white-space: pre-wrap;">
${data.text}
        </pre>


    </details>

`;

    } catch (err) {

        console.error(err);

        document.getElementById("analysis-result").innerHTML = `
            <h2 style="color:red;">❌ Error</h2>
            <p>${err.message}</p>
        `;
    }

};