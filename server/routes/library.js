import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Paper from '../models/Paper.js';

const router = express.Router();

// Get user's library (all their papers)
router.get('/', authenticate, async (req, res) => {
  try {
    const papers = await Paper.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('filename originalName ageLevel createdAt category isPublic');

    const formattedPapers = papers.map(paper => ({
      id: paper._id.toString(),
      name: paper.filename,
      originalName: paper.originalName,
      ageLevel: paper.ageLevel,
      category: paper.category || 'General',
      isPublic: paper.isPublic,
      createdAt: paper.createdAt
    }));

    res.json({ library: formattedPapers });
  } catch (error) {
    console.error('Library fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch library', message: error.message });
  }
});

export default router;
