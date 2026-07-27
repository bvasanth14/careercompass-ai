function checkATS(resumeText) {

    resumeText = resumeText.toLowerCase();

    let score = 0;

    let strengths = [];
    let improvements = [];


    // =====================================
    // 1. Resume Sections Check (25 Marks)
    // =====================================

    let sections = [
        "summary",
        "education",
        "skills",
        "project",
        "certificate",
        "experience"
    ];


    let foundSections = 0;


    sections.forEach(section => {

        if (resumeText.includes(section)) {
            foundSections++;
        }

    });


    if (foundSections >= 5) {

        score += 25;
        strengths.push("Important resume sections detected");

    }

    else {

        score += foundSections * 4;
        improvements.push("Add missing resume sections");

    }



    // =====================================
    // 2. Keyword Matching (25 Marks)
    // =====================================

    let keywords = [

        "java",
        "python",
        "sql",
        "javascript",
        "html",
        "css",
        "react",
        "node",
        "git",
        "database"

    ];


    let keywordCount = 0;


    keywords.forEach(keyword => {

        if(resumeText.includes(keyword)) {

            keywordCount++;

        }

    });



    if(keywordCount >= 6) {

        score += 25;
        strengths.push("Good ATS keyword matching");

    }

    else {

        score += keywordCount * 3;

        improvements.push("Add more job-related keywords");

    }




    // =====================================
    // 3. Contact Information (15 Marks)
    // =====================================

    if(resumeText.includes("@")) {

        score += 5;
        strengths.push("Email detected");

    }

    else {

        improvements.push("Add email address");

    }



    if(/\d{10}/.test(resumeText)) {

        score += 5;
        strengths.push("Phone number detected");

    }

    else {

        improvements.push("Add phone number");

    }



    if(resumeText.includes("linkedin")) {

        score += 5;
        strengths.push("LinkedIn profile detected");

    }

    else {

        improvements.push("Add LinkedIn profile");

    }





    // =====================================
    // 4. ATS Formatting Check (20 Marks)
    // =====================================


    if(resumeText.length > 500) {

        score += 10;
        strengths.push("Readable resume content");

    }

    else {

        improvements.push("Increase resume content");

    }



    if(
        !resumeText.includes("table") &&
        !resumeText.includes("image")
    ) {

        score += 10;
        strengths.push("ATS-friendly formatting");

    }

    else {

        improvements.push("Avoid tables/images for ATS");

    }





    // =====================================
    // 5. Experience & Profile (15 Marks)
    // =====================================


    if(
        resumeText.includes("internship") ||
        resumeText.includes("experience")
    ) {

        score += 10;
        strengths.push("Experience section found");

    }

    else {

        improvements.push("Add internship or experience");

    }



    if(
        resumeText.includes("github")
    ) {

        score += 5;
        strengths.push("GitHub profile found");

    }

    else {

        improvements.push("Add GitHub profile");

    }




    return {

        atsScore: score,

        strengths: strengths,

        improvements: improvements

    };

}



module.exports = checkATS;