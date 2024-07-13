const express = require("express");
const Waitlist = require("../model/Waitlist");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    let waitlistEntry = await Waitlist.findOne({ email });
    if (waitlistEntry) {
      return res
        .status(400)
        .json({ message: "Email is already on the waitlist" });
    }

    waitlistEntry = new Waitlist({
      email,
    });

    await waitlistEntry.save();
    res.json({ message: "Successfully added to the waitlist" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
