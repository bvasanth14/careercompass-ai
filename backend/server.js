const express = require("express");

const app = express();

const PORT = 5000;

console.log("🚀 Server file loaded");

// Middleware - Logs every request
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 CareerCompass-AI Backend is Running Successfully!");
});

// API Route
app.get("/api/message", (req, res) => {
    console.log("Inside /api/message route");

    res.json({
        success: true,
        message: "Welcome to CareerCompass-AI Backend!",
        version: "1.0",
        status: "Server is working correctly!"
    });
});

// 404 Route (if the user enters a wrong URL)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server Running on http://localhost:${PORT}`);
});