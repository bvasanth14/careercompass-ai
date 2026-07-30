const express = require("express");
const router = express.Router();

const learningRoadmaps = require("../learningRoadmaps");

router.post("/", (req, res) => {

    const { role } = req.body;

    if (!role) {
        return res.status(400).json({
            message: "Career role is required"
        });
    }

    const roadmap = learningRoadmaps[role];

    if (!roadmap) {
        return res.status(404).json({
            message: "Roadmap not found"
        });
    }

    res.json(roadmap);

});

module.exports = router;