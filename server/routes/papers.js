import express from 'express';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth.js';
import { generateExplanation } from '../services/gemini.js';
import Paper from '../models/Paper.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { paperId } = req.params;
  if (paperId && !mongoose.Types.ObjectId.isValid(paperId)) {
    return res.status(400).json({ error: 'Invalid paper ID format' });
  }
  next();
};

// Process a research paper
router.post('/process', authenticate, async (req, res) => {
  try {
    const { filename, ageLevel } = req.body;
    const userId = req.userId;

    if (!filename || !ageLevel) {
      return res.status(400).json({ error: 'Filename and age level are required' });
    }

    // Check user's paper limit
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has reached their limit (for free tier)
    if (user.subscription === 'free' && user.papersProcessed >= user.papersLimit) {
      return res.status(403).json({ 
        error: 'Paper limit reached', 
        message: 'You have reached your monthly limit. Upgrade to Pro for unlimited papers.' 
      });
    }

    // Generate explanation using Gemini
    const explanation = await generateExplanation(filename, ageLevel);

    // Save paper to database
    const paper = new Paper({
      userId,
      filename: filename.replace(/\.[^/.]+$/, ''), // Remove extension
      originalName: filename,
      explanation,
      ageLevel
    });
    await paper.save();

    // Update user's papers processed count (only for free tier)
    if (user.subscription === 'free') {
      user.papersProcessed += 1;
      await user.save();
    }

    res.json({
      message: 'Paper processed successfully',
      paper: {
        id: paper._id.toString(),
        filename: paper.originalName,
        explanation: paper.explanation,
        ageLevel: paper.ageLevel,
        createdAt: paper.createdAt
      },
      user: {
        papersProcessed: user.papersProcessed,
        papersLimit: user.papersLimit
      }
    });
  } catch (error) {
    console.error('Paper processing error:', error);
    res.status(500).json({ error: 'Failed to process paper', message: error.message });
  }
});

// Get user's papers
router.get('/my-papers', authenticate, async (req, res) => {
  try {
    const papers = await Paper.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-explanation'); // Don't send full explanation in list

    const formattedPapers = papers.map(paper => ({
      id: paper._id.toString(),
      filename: paper.originalName,
      ageLevel: paper.ageLevel,
      createdAt: paper.createdAt,
      category: paper.category || 'General',
      isPublic: paper.isPublic
    }));

    res.json({ papers: formattedPapers });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ error: 'Failed to fetch papers', message: error.message });
  }
});

// Get specific paper
router.get('/:paperId', authenticate, validateObjectId, async (req, res) => {
  try {
    const paper = await Paper.findOne({ 
      _id: req.params.paperId, 
      userId: req.userId 
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json({ paper });
  } catch (error) {
    console.error('Get paper error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid paper ID format' });
    }
    res.status(500).json({ error: 'Failed to fetch paper', message: error.message });
  }
});

// Delete paper
router.delete('/:paperId', authenticate, validateObjectId, async (req, res) => {
  try {
    const paper = await Paper.findOneAndDelete({ 
      _id: req.params.paperId, 
      userId: req.userId 
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Delete paper error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid paper ID format' });
    }
    res.status(500).json({ error: 'Failed to delete paper', message: error.message });
  }
});

export default router;
