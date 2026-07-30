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



        const responseText = await response.text();

console.log("Raw Response:");
console.log(responseText);

const data = JSON.parse(responseText);
console.log(data);

// Store detected skills for Skill Gap Analyzer

detectedUserSkills = [];

for (const category in data.skills) {

    detectedUserSkills.push(
        ...data.skills[category]
    );

}

console.log("User Skills:", detectedUserSkills);



        if (!response.ok) {

            throw new Error(data.message);

        }



        // ==============================
        // Display Detected Skills
        // ==============================

        let skillsHTML = "";



        for (const category in data.skills) {


            if (data.skills[category].length > 0) {


                skillsHTML += `

                    <h3>${category}</h3>


                   <div class="skills-list">

                        ${
                            data.skills[category]
                           .map(skill => `
                          <span class="skill-badge">
                          ${skill}
                           </span>
                            `)
                          .join("")
                        }

                   </div>

                `;


            }


        }




        // ==============================
        // Display Resume Score
        // ==============================

           let scoreHTML = "";

if (data.resumeScore && data.atsResult) {

    scoreHTML = `

    <div class="score-container">

        <div class="score-box">

            <h3>📊 Resume Score</h3>

            <h1>${data.resumeScore.score}/100</h1>

            <div class="progress-bar">
                <div class="progress resume-progress"
                     style="width:${data.resumeScore.score}%;">
                </div>
            </div>

        </div>

        <div class="score-box">

            <h3>🤖 ATS Score</h3>

            <h1>${data.atsResult.atsScore}%</h1>

            <div class="progress-bar">
                <div class="progress ats-progress"
                     style="width:${data.atsResult.atsScore}%;">
                </div>
            </div>

        </div>

    </div>

    <div class="details-container">

        <div class="details-box">

            <h3>💪 Strengths</h3>

            <ul>

                ${
                    data.resumeScore.strengths
                    .map(item => `<li>✅ ${item}</li>`)
                    .join("")
                }

            </ul>

        </div>

        <div class="details-box">

            <h3>🚀 Improvements</h3>

            <ul>

                ${
                    data.resumeScore.improvements.length > 0
                    ?
                    data.resumeScore.improvements
                    .map(item => `<li>⚠️ ${item}</li>`)
                    .join("")
                    :
                    "<li>🎉 No major improvements</li>"
                }

            </ul>

        </div>

    </div>

    `;

}

let summaryHTML = "";

if (data.resumeScore && data.atsResult) {

    summaryHTML = `

    <div class="summary-card">

        <h3>📝 Overall Assessment</h3>

        <p>

        Your resume scored
        <strong>${data.resumeScore.score}/100</strong>
        with an ATS compatibility of
        <strong>${data.atsResult.atsScore}%</strong>.

        ${
            data.resumeScore.score >= 80
            ? "Excellent resume! You are well prepared for placements."
            : data.resumeScore.score >= 60
            ? "Your resume has a good foundation, but there are several areas that can be improved to increase your chances."
            : "Your resume needs significant improvements before applying for placements."
        }

        </p>

    </div>

    `;

}





        // ==============================
        // Final Result Display
        // ==============================


        document.getElementById("analysis-result").innerHTML = `



        <h2>✅ Resume Uploaded Successfully</h2>



        <p>

        <strong>File:</strong> ${data.file}

        </p>



        <hr>



        <h2>🎯 Skills Detected</h2>



        ${skillsHTML}



        ${scoreHTML}


        ${summaryHTML}




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



    }



    catch (err) {
    console.error("FULL ERROR:", err);

    alert(err.stack || err.message);

    document.getElementById("analysis-result").innerHTML = `
        <h2 style="color:red;">❌ Error</h2>
        <pre>${err.stack || err.message}</pre>
    `;
}


};

// =========================================
// Skill Gap Analyzer
// =========================================

let detectedUserSkills = [];


document.getElementById("analyzeGapBtn").onclick = async () => {


    const role = document.getElementById("jobRole").value;


    if (!role) {

        alert("Please select a career role");

        return;

    }



    if (detectedUserSkills.length === 0) {

        alert("Please upload and analyze a resume first");

        return;

    }



    try {


        const response = await fetch("/skill-gap", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },


            body: JSON.stringify({

                skills: detectedUserSkills,

                role: role

            })

        });



        const data = await response.json();


        console.log("Skill Gap Result:");
        console.log(data);



       document.getElementById("skill-gap-result").innerHTML = `


<div class="skill-match-card">

    <h3>📊 Skill Match</h3>

    <h1>${data.skillMatch}%</h1>

</div>



<div class="skill-box">

    <h3>✅ Current Skills</h3>

    <ul>

    ${
        data.currentSkills
        .map(skill => 
        `<li class="current-skill">✔ ${skill}</li>`
        )
        .join("")
    }

    </ul>

</div>




<div class="skill-box">

    <h3>❌ Missing Skills</h3>

    <ul>

    ${
        data.missingSkills
        .map(skill => 
        `<li class="missing-skill">⚠ ${skill}</li>`
        )
        .join("")
    }

    </ul>

</div>


`;


}
 catch(error){

        console.error(error);

        alert("Skill gap analysis failed");

    }


};
