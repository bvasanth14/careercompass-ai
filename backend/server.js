const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("🚀 CareerCompass-AI Backend is Running Successfully!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});