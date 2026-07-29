function extractResumeSections(text) {

    const data = {
        name: "",
        email: "",
        phone: "",
        education: [],
        skills: [],
        certificates: [],
        projects: []
    };

    // Extract Email
    const email = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);

    if (email) {
        data.email = email[0];
    }

    // Extract Phone
    const phone = text.match(/(\+91)?\s?[6-9]\d{9}/);

    if (phone) {
        data.phone = phone[0];
    }

    return data;
}

module.exports = extractResumeSections;