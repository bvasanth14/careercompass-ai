console.log("resume.js started");

const uploadBtn = document.getElementById("uploadBtn");
let detectedUserSkills = [];

uploadBtn.onclick = async () => {
    const file = document.getElementById("resume").files[0];

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    // Set loading state on button
    uploadBtn.innerHTML = `⏳ Analyzing Resume...`;
    uploadBtn.disabled = true;

    try {
        const response = await fetch("/upload-resume", {
            method: "POST",
            body: formData
        });

        const responseText = await response.text();
        console.log("Raw Response:", responseText);

        const data = JSON.parse(responseText);
        console.log("Parsed Data:", data);

        if (!response.ok) {
            throw new Error(data.message || "Failed to analyze resume.");
        }

        // Store detected skills for Skill Gap Analyzer
        detectedUserSkills = [];
        for (const category in data.skills) {
            detectedUserSkills.push(...data.skills[category]);
        }
        console.log("User Skills:", detectedUserSkills);

        // ==============================
        // Display Detected Skills
        // ==============================
        let skillsHTML = "";
        for (const category in data.skills) {
            if (data.skills[category].length > 0) {
                skillsHTML += `
                    <div class="mb-4">
                        <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">${category}</h4>
                        <div class="flex flex-wrap gap-2">
                            ${data.skills[category]
                                .map(skill => `
                                    <span class="px-3 py-1 rounded-xl text-xs font-medium bg-[#2d164d] text-[#ff2a85] border border-[#ff2a85]/30 shadow-sm">
                                        ${skill}
                                    </span>
                                `).join("")}
                        </div>
                    </div>
                `;
            }
        }

        // ==============================
        // Display Resume & ATS Scores
        // ==============================
        let scoreHTML = "";
        if (data.resumeScore && data.atsResult) {
            scoreHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <!-- Resume Score Box -->
                    <div class="p-5 rounded-2xl bg-[#10061e] border border-white/10 flex flex-col justify-between space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-slate-400">📊 Resume Score</span>
                            <span class="text-2xl font-black text-white">${data.resumeScore.score}/100</span>
                        </div>
                        <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div class="bg-gradient-to-r from-[#ff2a85] to-[#c026d3] h-full rounded-full transition-all duration-500" style="width:${data.resumeScore.score}%;"></div>
                        </div>
                    </div>

                    <!-- ATS Score Box -->
                    <div class="p-5 rounded-2xl bg-[#10061e] border border-white/10 flex flex-col justify-between space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-slate-400">🤖 ATS Score</span>
                            <span class="text-2xl font-black text-white">${data.atsResult.atsScore}%</span>
                        </div>
                        <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div class="bg-gradient-to-r from-[#7928ca] to-[#ff2a85] h-full rounded-full transition-all duration-500" style="width:${data.atsResult.atsScore}%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Strengths & Improvements -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <!-- Strengths -->
                    <div class="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                        <h3 class="text-sm font-bold text-emerald-400 flex items-center gap-2">💪 Strengths</h3>
                        <ul class="space-y-2 text-xs text-slate-300">
                            ${data.resumeScore.strengths.map(item => `
                                <li class="flex items-start gap-2">
                                    <span class="text-emerald-400 font-bold">✓</span> <span>${item}</span>
                                </li>
                            `).join("")}
                        </ul>
                    </div>

                    <!-- Improvements -->
                    <div class="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                        <h3 class="text-sm font-bold text-amber-400 flex items-center gap-2">🚀 Improvements Needed</h3>
                        <ul class="space-y-2 text-xs text-slate-300">
                            ${data.resumeScore.improvements.length > 0
                                ? data.resumeScore.improvements.map(item => `
                                    <li class="flex items-start gap-2">
                                        <span class="text-amber-400 font-bold">⚠️</span> <span>${item}</span>
                                    </li>
                                `).join("")
                                : '<li class="text-emerald-400">🎉 No major improvements needed!</li>'
                            }
                        </ul>
                    </div>
                </div>
            `;
        }

        // ==============================
        // Display Summary Card
        // ==============================
        let summaryHTML = "";
        if (data.resumeScore && data.atsResult) {
            summaryHTML = `
                <div class="p-5 rounded-2xl bg-[#10061e] border border-white/10 my-4 space-y-2">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2">📝 Overall Assessment</h3>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        Your resume scored <strong class="text-white">${data.resumeScore.score}/100</strong> with an ATS compatibility of <strong class="text-white">${data.atsResult.atsScore}%</strong>.
                        ${data.resumeScore.score >= 80
                            ? " Excellent resume! You are well prepared for placements."
                            : data.resumeScore.score >= 60
                            ? " Your resume has a good foundation, but there are several key areas to refine to maximize call-backs."
                            : " Your resume needs significant improvements before applying for target roles."
                        }
                    </p>
                </div>
            `;
        }

        // ==============================
        // Render Final Container
        // ==============================
        document.getElementById("analysis-result").innerHTML = `
            <div class="w-full space-y-6 text-left">
                <!-- Status Banner -->
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-sm">
                    <span class="font-bold flex items-center gap-2">
                        ✅ Resume Processed Successfully
                    </span>
                    <span class="text-xs text-slate-400 truncate max-w-[200px]">${data.file}</span>
                </div>

                <!-- Detected Skills -->
                <div class="space-y-3">
                    <h3 class="text-base font-bold text-white flex items-center gap-2">🎯 Skills Detected</h3>
                    ${skillsHTML}
                </div>

                <hr class="border-white/10">

                <!-- Scores & Assessment -->
                ${scoreHTML}
                ${summaryHTML}

                <hr class="border-white/10">

                <!-- Extracted Raw Text Dropdown -->
                <details class="group p-4 rounded-2xl bg-[#10061e] border border-white/10 text-xs text-slate-400 cursor-pointer">
                    <summary class="font-semibold text-slate-300 hover:text-white flex items-center justify-between select-none">
                        <span>📄 View Extracted Resume Text</span>
                        <span class="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <pre class="mt-3 p-4 rounded-xl bg-[#0d0714] text-slate-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-60 border border-white/5 leading-relaxed">${data.text}</pre>
                </details>
            </div>
        `;

    } catch (err) {
        console.error("FULL ERROR:", err);
        document.getElementById("analysis-result").innerHTML = `
            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-left w-full">
                <h3 class="font-bold text-sm mb-1">❌ Analysis Failed</h3>
                <pre class="whitespace-pre-wrap font-mono mt-2 text-[11px]">${err.stack || err.message}</pre>
            </div>
        `;
    } finally {
        uploadBtn.innerHTML = `📤 Upload & Analyze Resume`;
        uploadBtn.disabled = false;
    }
};

// =========================================
// Skill Gap Analyzer
// =========================================
document.getElementById("analyzeGapBtn").onclick = async () => {
    const role = document.getElementById("jobRole").value;

    if (!role) {
        alert("Please select a career role.");
        return;
    }

    if (detectedUserSkills.length === 0) {
        alert("Please upload and analyze a resume first.");
        return;
    }

    const gapBtn = document.getElementById("analyzeGapBtn");
    gapBtn.innerHTML = `⏳ Analyzing...`;
    gapBtn.disabled = true;

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
        console.log("Skill Gap Result:", data);

        document.getElementById("skill-gap-result").innerHTML = `
            <div class="space-y-4 text-left w-full">
                <!-- Skill Match Percentage Card -->
                <div class="p-5 rounded-2xl bg-gradient-to-r from-[#7928ca]/20 to-[#ff2a85]/20 border border-[#ff2a85]/30 flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-bold text-white">📊 Target Role Match: ${role}</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Based on required skill benchmarks</p>
                    </div>
                    <span class="text-3xl font-black text-[#ff2a85]">${data.skillMatch}%</span>
                </div>

                <!-- Skill Comparison Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Current Matching Skills -->
                    <div class="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                        <h3 class="text-sm font-bold text-emerald-400 flex items-center gap-2">✅ Matching Skills</h3>
                        <div class="flex flex-wrap gap-2">
                            ${data.currentSkills.length > 0
                                ? data.currentSkills.map(skill => `
                                    <span class="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✔ ${skill}</span>
                                `).join("")
                                : '<span class="text-xs text-slate-500">No matching skills found</span>'
                            }
                        </div>
                    </div>

                    <!-- Missing Skills -->
                    <div class="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                        <h3 class="text-sm font-bold text-rose-400 flex items-center gap-2">❌ Recommended Skills to Learn</h3>
                        <div class="flex flex-wrap gap-2">
                            ${data.missingSkills.length > 0
                                ? data.missingSkills.map(skill => `
                                    <span class="px-2.5 py-1 rounded-lg text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30">⚠️ ${skill}</span>
                                `).join("")
                                : '<span class="text-xs text-emerald-400">🎉 You have all required skills!</span>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        alert("Skill gap analysis failed.");
    } finally {
        gapBtn.innerHTML = `✨ Analyze Skill Gap`;
        gapBtn.disabled = false;
    }
};