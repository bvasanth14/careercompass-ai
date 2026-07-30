const generateBtn = document.getElementById("generateRoadmapBtn");

generateBtn.onclick = async () => {

    const role = document.getElementById("careerRole").value;

    if (!role) {
        alert("Please select a career role.");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/roadmap", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                role: role
            })

        });

        const roadmap = await response.json();

        console.log(roadmap);

        if (!response.ok) {

            document.getElementById("roadmap-result").innerHTML = `
                <h2>${roadmap.message}</h2>
            `;

            return;

        }

        let html = `

            <div class="roadmap-header">

                <h2>🎯 ${roadmap.goal}</h2>

                <p><strong>Estimated Duration:</strong> ${roadmap.duration}</p>

            </div>

        `;

        roadmap.phases.forEach((phase, index) => {

            html += `

            <div class="roadmap-phase">

                <h2>📘 ${phase.title}</h2>

                <p><strong>Duration:</strong> ${phase.duration}</p>

                <h3>📚 Topics to Learn</h3>

                <ul>

                    ${phase.learn.map(topic => `<li>✅ ${topic}</li>`).join("")}

                </ul>

            `;

            if (phase.practice) {

                html += `

                <h3>💻 Practice</h3>

                <ul>

                    ${phase.practice.map(item => `<li>💻 ${item}</li>`).join("")}

                </ul>

                `;

            }

            if (phase.projects) {

                html += `

                <h3>🚀 Projects</h3>

                <ul>

                    ${phase.projects.map(project => `<li>🚀 ${project}</li>`).join("")}

                </ul>

                `;

            }

            if (phase.certifications) {

                html += `

                <h3>🏆 Certifications</h3>

                <ul>

                    ${phase.certifications.map(cert => `<li>🏆 ${cert}</li>`).join("")}

                </ul>

                `;

            }

            html += `</div>`;

        });

        html += `

        <div class="career-options">

            <h2>💼 Career Opportunities</h2>

            <ul>

                ${roadmap.careerOptions.map(job => `<li>💼 ${job}</li>`).join("")}

            </ul>

        </div>

        `;

        document.getElementById("roadmap-result").innerHTML = html;

    }

    catch (err) {

        console.error(err);

        alert("Unable to load roadmap.");

    }

};