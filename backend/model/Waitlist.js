const mongoose = require("mongoose");

const { Schema } = mongoose;

const WaitlistSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Waitlist = mongoose.model("waitlist", WaitlistSchema);
