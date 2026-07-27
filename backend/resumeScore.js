function calculateResumeScore(resumeText, detectedSkills) {

    let score = 0;

    let strengths = [];
    let improvements = [];

    resumeText = resumeText.toLowerCase();


    // ===============================
    // 1. Skills (25 Marks)
    // ===============================

    let totalSkills = 0;

    for (const category in detectedSkills) {
        totalSkills += detectedSkills[category].length;
    }


    if (totalSkills >= 8) {
        score += 25;
        strengths.push("Strong technical skill set");
    }
    else if (totalSkills >= 4) {
        score += 18;
        strengths.push("Basic technical skills available");
        improvements.push("Learn more industry technologies");
    }
    else if (totalSkills > 0) {
        score += 10;
        improvements.push("Add more technical skills");
    }
    else {
        improvements.push("Technical skills missing");
    }



    // ===============================
    // 2. Projects (20 Marks)
    // ===============================

    if (
        resumeText.includes("github") ||
        resumeText.includes("project") ||
        resumeText.includes("developed") ||
        resumeText.includes("built")
    ) {

        score += 15;
        strengths.push("Projects mentioned");

    }
    else {

        improvements.push("Add technical projects");

    }


    if (
        resumeText.includes("github")
    ) {

        score += 5;
        strengths.push("GitHub profile available");

    }
    else {

        improvements.push("Add GitHub profile");

    }



    // ===============================
    // 3. Certifications (10 Marks)
    // ===============================

    if (
        resumeText.includes("certificate") ||
        resumeText.includes("certification") ||
        resumeText.includes("workshop")
    ) {

        score += 10;
        strengths.push("Certifications available");

    }
    else {

        improvements.push("Add relevant certifications");

    }



    // ===============================
    // 4. Education (10 Marks)
    // ===============================

    if (
        resumeText.includes("b.tech") ||
        resumeText.includes("bachelor") ||
        resumeText.includes("education") ||
        resumeText.includes("cgpa")
    ) {

        score += 10;
        strengths.push("Academic details available");

    }
    else {

        improvements.push("Add education details");

    }



    // ===============================
    // 5. Contact/Profile (10 Marks)
    // ===============================

    let email = resumeText.includes("@");
    let phone = /\d{10}/.test(resumeText);
    let linkedin = resumeText.includes("linkedin");


    if (email && phone) {

        score += 7;
        strengths.push("Contact information available");

    }
    else {

        improvements.push("Complete contact details");

    }


    if (linkedin) {

        score += 3;
        strengths.push("LinkedIn profile available");

    }
    else {

        improvements.push("Add LinkedIn profile");

    }



    // ===============================
    // 6. Experience (10 Marks)
    // ===============================

    if (
        resumeText.includes("internship") ||
        resumeText.includes("experience")
    ) {

        score += 10;
        strengths.push("Professional experience found");

    }
    else {

        improvements.push("Add internship experience");

    }



    // ===============================
    // 7. ATS Keywords (5 Marks)
    // ===============================

    let atsKeywords = [
        "sql",
        "javascript",
        "java",
        "python",
        "react",
        "node",
        "git"
    ];


    let keywordCount = 0;


    atsKeywords.forEach(keyword => {

        if(resumeText.includes(keyword)) {
            keywordCount++;
        }

    });


    if(keywordCount >= 4) {

        score += 5;
        strengths.push("Good ATS keyword matching");

    }
    else {

        improvements.push("Add more job-related keywords");

    }



    // ===============================
    // 8. Resume Quality (10 Marks)
    // ===============================

    if(resumeText.length > 800) {

        score += 10;
        strengths.push("Detailed resume content");

    }
    else if(resumeText.length > 400) {

        score += 5;
        improvements.push("Improve resume details");

    }
    else {

        improvements.push("Resume content is too short");

    }



    return {

        score,

        strengths,

        improvements

    };

}


module.exports = calculateResumeScore;