// =========================================
// CareerCompass-AI
// Professional Resume Extractor
// =========================================

function cleanLines(text) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

// =========================================
// Personal Information
// =========================================

function extractPersonalInfo(lines) {

    const data = {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: ""
    };

    // Email
    const emailLine = lines.find(line =>
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(line)
    );

    if (emailLine) {
        data.email = emailLine.match(
            /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
        )[0];
    }

    // Phone
    const phoneLine = lines.find(line =>
        /(\+91)?\s?[6-9]\d{9}/.test(line)
    );

    if (phoneLine) {
        data.phone = phoneLine.match(
            /(\+91)?\s?[6-9]\d{9}/
        )[0].trim();
    }

    // LinkedIn
    const linkedinLine = lines.find(line =>
        line.toLowerCase().includes("linkedin.com")
    );

    if (linkedinLine) {
        data.linkedin = linkedinLine;
    }

    // GitHub
    const githubLine = lines.find(line =>
        line.toLowerCase().includes("github.com")
    );

    if (githubLine) {
        data.github = githubLine;
    }

    // Name
    for (const line of lines) {

        if (
            line.includes("@") ||
            line.startsWith("http") ||
            /(\+91)?\s?[6-9]\d{9}/.test(line)
        ) {
            continue;
        }

        const upper = line.toUpperCase();

        if (
            upper === "SUMMARY" ||
            upper === "OBJECTIVE" ||
            upper === "PROFILE"
        ) {
            continue;
        }

        if (line.split(" ").length >= 2 && line.split(" ").length <= 4) {
            data.name = line;
            break;
        }
    }

    // Location
    for (const line of lines) {

        if (
            line.toLowerCase().includes("chennai") ||
            line.toLowerCase().includes("tamil") ||
            line.toLowerCase().includes("india")
        ) {
            data.location = line;
            break;
        }
    }

    return data;
}

// =========================================
// Education
// =========================================

function extractEducation(lines) {

    const education = [];

    const educationKeywords = [
        "education",
        "academic",
        "qualification"
    ];

    let start = -1;

    for (let i = 0; i < lines.length; i++) {

        const lower = lines[i].toLowerCase();

        if (educationKeywords.includes(lower)) {
            start = i + 1;
            break;
        }
    }

    if (start === -1) return education;

    const stopWords = [
        "skills",
        "projects",
        "certificates",
        "experience",
        "summary",
        "objective"
    ];

    const edu = {
        degree: "",
        college: "",
        cgpa: "",
        duration: ""
    };

    for (let i = start; i < lines.length; i++) {

        const line = lines[i];
        const lower = line.toLowerCase();

        if (stopWords.includes(lower))
            break;

        if (
            lower.includes("b.tech") ||
            lower.includes("bachelor") ||
            lower.includes("be ") ||
            lower.includes("master") ||
            lower.includes("m.tech")
        ) {
            edu.degree = line;
            continue;
        }

        if (
            lower.includes("college") ||
            lower.includes("university") ||
            lower.includes("institute")
        ) {
            if (!edu.college)
                edu.college = line;
        }

        if (lower.includes("cgpa")) {
            edu.cgpa = line;
        }

        if (
            /\d{2}\/\d{4}/.test(line) ||
            /\d{4}\s*[–-]\s*\d{4}/.test(line)
        ) {
            edu.duration = line;
        }
    }

    if (edu.degree !== "") {
        education.push(edu);
    }

    return education;
}



// =========================================
// Projects
// =========================================

function extractProjects(lines) {

    const projects = [];

    let inside = false;

    const stopWords = [
        "experience",
        "education",
        "skills",
        "certificates"
    ];

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (line.toLowerCase() === "projects") {
            inside = true;
            continue;
        }

        if (!inside) continue;

        if (stopWords.includes(line.toLowerCase()))
            break;

        if (
            line.startsWith("•") ||
            line.startsWith("-") ||
            /\d{2}\/\d{4}/.test(line)
        )
            continue;

        if (line.length > 35)
            continue;

        if (
            /^[A-Z0-9][A-Za-z0-9\s\-&()]+$/.test(line)
        ) {
            projects.push(line);
        }
    }

    return projects;
}

// =========================================
// Skills
// =========================================

function extractSkills(detectedSkills) {

    const skills = [];

    if (!detectedSkills) return skills;

    for (const category in detectedSkills) {
        skills.push(...detectedSkills[category]);
    }

    return skills;
}

// =========================================
// Certificates
// =========================================

function extractCertificates(lines) {

    const certificates = [];

    let inside = false;

    const stopWords = [
        "projects",
        "experience",
        "skills",
        "education",
        "achievements"
    ];

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (
            line.toLowerCase() === "certificates" ||
            line.toLowerCase() === "certifications"
        ) {
            inside = true;
            continue;
        }

        if (!inside) continue;

        if (stopWords.includes(line.toLowerCase()))
            break;

        if (
            line.startsWith("•") ||
            line.startsWith("-")
        )
            continue;

        if (line.length < 5)
            continue;

        if (line.length > 80)
            continue;

        certificates.push(line);

    }

    return [...new Set(certificates)];
}



// =========================================
// Experience
// =========================================

function extractExperience(lines) {

    const experience = [];

    let inside = false;

    const stopWords = [
        "projects",
        "skills",
        "education",
        "certificates",
        "achievements"
    ];

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (
            line.toLowerCase() === "experience" ||
            line.toLowerCase() === "internship"
        ) {
            inside = true;
            continue;
        }

        if (!inside) continue;

        if (stopWords.includes(line.toLowerCase()))
            break;

        if (line.length < 3)
            continue;

        experience.push(line);

    }

    return experience;

}



// =========================================
// Skills
// =========================================

function extractSkills(detectedSkills) {

    const skills = [];

    if (!detectedSkills)
        return skills;

    for (const category in detectedSkills) {

        skills.push(...detectedSkills[category]);

    }

    return [...new Set(skills)];


}

// =========================================
// Achievements
// =========================================

function extractAchievements(lines) {

    const achievements = [];

    let inside = false;

    const stopWords = [
        "experience",
        "projects",
        "skills",
        "education",
        "certificates"
    ];

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (
            line.toLowerCase() === "achievements" ||
            line.toLowerCase() === "awards" ||
            line.toLowerCase() === "workshops"
        ) {
            inside = true;
            continue;
        }

        if (!inside) continue;

        if (stopWords.includes(line.toLowerCase()))
            break;

        if (line.length < 3)
            continue;

        achievements.push(line);

    }

    return [...new Set(achievements)];

}

// =========================================
// Main Function
// =========================================

function extractResumeSections(text, detectedSkills) {

    const lines = cleanLines(text);

    const personalInfo = extractPersonalInfo(lines);

    return {

        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        linkedin: personalInfo.linkedin,
        github: personalInfo.github,

        education: extractEducation(lines),

        skills: extractSkills(detectedSkills),

        certificates: extractCertificates(lines),

        projects: extractProjects(lines),

        experience: extractExperience(lines),

        achievements: extractAchievements(lines)

    };

}

module.exports = extractResumeSections;

