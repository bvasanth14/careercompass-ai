function extractResumeSections(text) {

    const data = {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        education: [],
        skills: [],
        certificates: [],
        projects: [],
        experience: []
    };

    // ==========================
    // Email
    // ==========================
    const email = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);

    if (email) {
        data.email = email[0];
    }

    // ==========================
    // Phone
    // ==========================
    const phone = text.match(/(\+91)?\s?[6-9]\d{9}/);

    if (phone) {
        data.phone = phone[0].trim();
    }

    // ==========================
    // LinkedIn
    // ==========================
    const linkedin = text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s]+/i);

    if (linkedin) {
        data.linkedin = linkedin[0];
    }

    // ==========================
    // GitHub
    // ==========================
    const github = text.match(/https?:\/\/(www\.)?github\.com\/[^\s]+/i);

    if (github) {
        data.github = github[0];
    }

    // ==========================
    // Split Resume into Lines
    // ==========================
    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // ==========================
    // Extract Name
    // ==========================
    for (const line of lines) {

        if (
            line.includes("@") ||
            /^https?:\/\//i.test(line) ||
            /(\+91)?\s?[6-9]\d{9}/.test(line)
        ) {
            continue;
        }

        data.name = line;
        break;
    }

    // ==========================
    // Extract Location
    // ==========================
    for (const line of lines) {

        if (
            line === data.name ||
            line === data.email ||
            line === data.phone ||
            line === data.linkedin
        ) {
            continue;
        }

        if (
            !line.includes("@") &&
            !/^https?:\/\//i.test(line) &&
            line.includes(",") &&
            line.length < 50
        ) {
            data.location = line;
            break;
        }
    }

    return data;
}

module.exports = extractResumeSections;