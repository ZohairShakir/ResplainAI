dotenv.config();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import paperRoutes from './routes/papers.js';
import galleryRoutes from './routes/gallery.js';
import libraryRoutes from './routes/library.js';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("-----------------------------------------");
console.log("Current Working Directory:", process.cwd());
console.log("File __dirname:", __dirname);
console.log("Looking for .env at:", path.resolve(process.cwd(), '.env'));
console.log("GEMINI_API_KEY exists in memory:", !!process.env.GEMINI_API_KEY);
console.log("-----------------------------------------");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));    

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/library', libraryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resplain AI Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
