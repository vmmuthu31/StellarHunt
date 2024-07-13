const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const waitlistRoutes = require("./routes/waitlist");

mongoose.connect(
  "mongodb+srv://vairamuthu:vairamuthu@cluster0.2qcddvx.mongodb.net/StellarHunt"
);
const cors = require("cors");
app.use(cors("*"));

app.use("/api/waitlist", waitlistRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
