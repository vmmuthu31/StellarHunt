import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import waitlistRoutes from './routes/waitlist.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5050;
let MONGODB_URI="mongodb+srv://shahsai11111:12345@stellarhunt.dxxeee6.mongodb.net/?retryWrites=true&w=majority&appName=StellarHunt"
// Middleware
app.use(cors("*"));
app.use(bodyParser.json());

// Basic root route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Routes
app.use('/api/waitlist', waitlistRoutes);

app.listen(port, () => console.log(`Server running on port ${port}, following URL: http://localhost:5050/`));

