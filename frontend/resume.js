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



        // ==============================
        // Display Detected Skills
        // ==============================

        let skillsHTML = "";



        for (const category in data.skills) {


            if (data.skills[category].length > 0) {


                skillsHTML += `

                    <h3>${category}</h3>


                    <ul>

                        ${
                            data.skills[category]
                            .map(skill => `<li>✅ ${skill}</li>`)
                            .join("")
                        }

                    </ul>

                `;


            }


        }




        // ==============================
        // Display Resume Score
        // ==============================


        let scoreHTML = "";



        if (data.resumeScore) {


            scoreHTML = `


            <hr>


            <h2>📊 Resume Score</h2>


            <div class="score-card">


                <h1>

                    ${data.resumeScore.score}/100

                </h1>



                <h3>💪 Strengths</h3>


                <ul>

                    ${
                        data.resumeScore.strengths
                        .map(item => `<li>✅ ${item}</li>`)
                        .join("")
                    }

                </ul>




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


        console.error(err);



        document.getElementById("analysis-result").innerHTML = `


            <h2 style="color:red;">

            ❌ Error

            </h2>


            <p>

            ${err.message}

            </p>


        `;


    }


};