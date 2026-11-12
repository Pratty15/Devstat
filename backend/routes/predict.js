const express = require("express");
const axios = require("axios");
const { getUserFeatures } = require("../services/githubService");

const router = express.Router();

router.post("/", async (req, res) => {
    const username = req.body.username;

    try {
        const { features, stats } = await getUserFeatures(username);

        const prediction = await axios.post(
            "http://localhost:5001/predict",
            { features }
        );

        res.json({
    impact: prediction.data.prediction,
    stats: stats
});

    } 
    catch (err) {
        console.log(err.message);
        res.json({ error: err.message });
    }
});

module.exports = router;