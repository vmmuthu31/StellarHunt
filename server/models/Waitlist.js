import mongoose from 'mongoose';

const { Schema } = mongoose;

const WaitlistSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Waitlist', WaitlistSchema);
