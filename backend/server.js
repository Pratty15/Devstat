const express = require("express");
const predictRoute = require("./routes/predict");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/predict", predictRoute);
app.listen(5000, () => console.log("Server running"));