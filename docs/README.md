
# 🧭 CareerCompass-AI

CareerCompass-AI is a modern, full-stack web application designed to help students and professionals navigate their career paths using intelligent tools, ATS resume analysis, skill roadmaps, and mock interview preparation.

---

## ✨ Features

- **Authentication & User Management:** Secure login, user registration, and password recovery pages (`login.html`, `register.html`, `forgot-password.html`).
- **Dashboard:** Centralized hub tracking your overall career progress, statistics, and shortcuts (`dashboard.html`).
- **Profile & Settings:** Manage personal profile details, account preferences, and custom themes (`profile.html`, `settings.html`).
- **Resume Analyzer & ATS Checker:** Upload resumes, extract text, evaluate ATS compatibility scores, and get actionable feedback (`resume-analyzer.html`).
- **Skill Roadmaps:** Custom learning paths and skill gap analysis tailored to specific career goals and tech stacks (`skill-roadmap.html`).
- **Placement Checker:** Evaluate your readiness for campus placements and job applications (`placement-checker.html`).
- **Mock Interview:** Practice interview questions to improve technical and soft skills (`mock-interview.html`).
- **Portfolio Management:** Showcase your technical projects and earned certificates (`projects.html`, `certificates.html`).

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, and dynamic modular scripts
- **Backend:** Node.js, Express.js, custom analysis modules (ATS checker, resume extractor, skill gap analyzer)
- **Storage/Database:** Database integration (`db.js`), local file storage (`uploads/`), and LocalStorage

---

## 📁 Project Structure

```text
CareerCompass-AI/
├── assets/
│   └── images/              # Shared image assets
├── backend/
│   ├── routes/              # API routing modules (e.g., roadmap.js)
│   ├── uploads/             # Temporary user upload directory
│   ├── server.js            # Main backend entry point
│   ├── db.js                # Database configuration
│   ├── atsChecker.js        # ATS compatibility logic
│   ├── resumeExtractor.js   # Resume text extraction utility
│   ├── resumeScore.js       # Resume scoring logic
│   ├── skillGapAnalyzer.js  # Skill gap evaluation utility
│   ├── jobRoles.js          # Target job role configurations
│   ├── learningRoadmaps.js  # Roadmap generation logic
│   ├── package.json         # Backend dependencies
│   └── node_modules/        # Installed Node modules
├── frontend/
│   ├── index.html           # Landing page
│   ├── login.html           # User login page
│   ├── register.html        # User registration page
│   ├── dashboard.html       # Main user dashboard
│   ├── profile.html         # User profile page
│   ├── resume-analyzer.html # ATS resume analyzer interface
│   ├── placement-checker.html# Placement readiness checker
│   ├── skill-roadmap.html   # Custom skill roadmaps interface
│   ├── projects.html        # Project portfolio page
│   ├── certificates.html    # Certificates showcase page
│   ├── mock-interview.html  # Mock interview practice interface
│   ├── settings.html        # Settings and preferences page
│   ├── forgot-password.html # Password recovery page
│   ├── script.js            # Global core script
│   ├── register.js          # Registration logic
│   ├── profile.js           # Profile logic
│   ├── resume.js            # Resume analysis frontend script
│   ├── skill-roadmap.js     # Roadmap frontend script
│   └── theme.js             # Theme switcher logic
├── docs/
│   ├── README.md            # Project documentation
│   └── PROJECT_PROGRESS.md  # Project progress tracking
├── .gitignore               # Git ignored files and folders
└── .

