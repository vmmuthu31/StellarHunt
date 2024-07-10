import express from 'express';
import Waitlist from '../models/Waitlist.js';

const router = express.Router();

// POST api/waitlist
// Add a new email and wallet address to the waitlist
router.post('api/waitlist', async (req, res) => {
  const { email, walletAddress } = req.body;

  try {
    let waitlistEntry = await Waitlist.findOne({ email });
    if (waitlistEntry) {
      return res.status(400).json({ message: 'Email is already on the waitlist' });
    }

    waitlistEntry = new Waitlist({
      email,
      walletAddress,
    });

    await waitlistEntry.save();
    res.json({ message: 'Successfully added to the waitlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
