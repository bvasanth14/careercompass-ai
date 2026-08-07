const generateBtn = document.getElementById("generateRoadmapBtn");

generateBtn.onclick = async () => {
    const role = document.getElementById("careerRole").value;

    if (!role) {
        alert("Please select a career role.");
        return;
    }

    const resultArea = document.getElementById("roadmap-result");

    // Loading State
    resultArea.innerHTML = `
        <div class="py-12 flex flex-col items-center justify-center space-y-4">
            <div class="w-10 h-10 border-4 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-slate-300 font-medium">Generating structured learning path for <span class="text-[#ff2a85]">${role}</span>...</p>
        </div>
    `;

    try {
        const response = await fetch("http://localhost:5000/roadmap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role })
        });

        const roadmap = await response.json();

        if (!response.ok) {
            resultArea.innerHTML = `
                <div class="text-center py-12 text-rose-400 space-y-2">
                    <h3 class="text-lg font-bold">Error</h3>
                    <p class="text-sm">${roadmap.message || "Failed to generate roadmap."}</p>
                </div>
            `;
            return;
        }

        // Build Styled Tailwind HTML Structure
        let html = `
            <div class="space-y-8 text-left">
                <!-- Header Card -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
                    <div>
                        <h3 class="text-xl font-extrabold text-white flex items-center gap-2">
                            <span>🎯</span> ${roadmap.goal || role + " Roadmap"}
                        </h3>
                        <p class="text-xs text-slate-400 mt-1">
                            <strong class="text-slate-300">Estimated Duration:</strong> ${roadmap.duration || "N/A"}
                        </p>
                    </div>
                    <span class="px-3.5 py-1.5 rounded-full bg-[#ff2a85]/20 text-[#ff2a85] text-xs font-semibold border border-[#ff2a85]/30">
                        ${roadmap.phases ? roadmap.phases.length : 0} Modules
                    </span>
                </div>

                <!-- Timeline Container -->
                <div class="space-y-6 relative border-l-2 border-[#ff2a85]/30 ml-4 pl-6">
        `;

        if (roadmap.phases && roadmap.phases.length > 0) {
            roadmap.phases.forEach((phase, index) => {
                const colors = ["bg-[#ff2a85]", "bg-[#c026d3]", "bg-purple-500", "bg-emerald-400", "bg-blue-500"];
                const dotColor = colors[index % colors.length];

                html += `
                    <div class="relative p-6 rounded-2xl bg-[#10061e] border border-white/10 hover:border-[#ff2a85]/40 transition-all shadow-xl space-y-4">
                        <span class="absolute -left-[31px] top-6 w-4 h-4 rounded-full ${dotColor} border-4 border-[#170c28]"></span>
                        
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-[#ff2a85]/10 text-[#ff2a85] border border-[#ff2a85]/20">
                                Phase ${index + 1}
                            </span>
                            <span class="text-xs text-slate-400 font-medium">⏱️ ${phase.duration || "Self-paced"}</span>
                        </div>

                        <h4 class="text-base font-bold text-white">${phase.title}</h4>

                        ${phase.learn && phase.learn.length > 0 ? `
                            <div class="space-y-2 pt-2 border-t border-white/5">
                                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">📚 Topics to Learn</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    ${phase.learn.map(topic => `
                                        <div class="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                            <span class="text-emerald-400">✅</span> ${topic}
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        ` : ''}

                        ${phase.practice && phase.practice.length > 0 ? `
                            <div class="space-y-2 pt-2 border-t border-white/5">
                                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">💻 Practice</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    ${phase.practice.map(item => `
                                        <div class="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                            <span class="text-[#ff2a85]">💻</span> ${item}
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        ` : ''}

                        ${phase.projects && phase.projects.length > 0 ? `
                            <div class="space-y-2 pt-2 border-t border-white/5">
                                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">🚀 Projects</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    ${phase.projects.map(project => `
                                        <div class="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                            <span class="text-purple-400">🚀</span> ${project}
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        ` : ''}

                        ${phase.certifications && phase.certifications.length > 0 ? `
                            <div class="space-y-2 pt-2 border-t border-white/5">
                                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">🏆 Certifications</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    ${phase.certifications.map(cert => `
                                        <div class="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                            <span class="text-amber-400">🏆</span> ${cert}
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }

        html += `</div>`;

        if (roadmap.careerOptions && roadmap.careerOptions.length > 0) {
            html += `
                <div class="mt-8 p-6 rounded-2xl bg-[#10061e] border border-white/10 shadow-xl space-y-4">
                    <h4 class="text-base font-bold text-white flex items-center gap-2">💼 Career Opportunities</h4>
                    <div class="flex flex-wrap gap-2">
                        ${roadmap.careerOptions.map(job => `
                            <span class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff2a85]/10 to-[#c026d3]/10 border border-[#ff2a85]/20 text-xs font-medium text-slate-200 flex items-center gap-1.5">
                                💼 ${job}
                            </span>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        html += `</div>`;

        resultArea.innerHTML = html;
        lucide.createIcons();

    } catch (err) {
        console.error(err);
        resultArea.innerHTML = `
            <div class="text-center py-12 text-rose-400 space-y-2">
                <h3 class="text-lg font-bold">Connection Error</h3>
                <p class="text-sm">Unable to connect to the backend server at http://localhost:5000.</p>
            </div>
        `;
    }
};