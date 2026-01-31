import express from 'express';
import mongoose from 'mongoose';
import Paper from '../models/Paper.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { paperId } = req.params;
  if (paperId && !mongoose.Types.ObjectId.isValid(paperId)) {
    return res.status(400).json({ error: 'Invalid paper ID format' });
  }
  next();
};

// Get all public papers (gallery)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    const papers = await Paper.find(query)
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(100)
      .select('filename originalName category createdAt userId explanation');

    const formattedPapers = papers.map(paper => ({
      id: paper._id.toString(),
      title: paper.filename,
      author: paper.userId?.email || 'Anonymous',
      category: paper.category || 'General',
      summary: paper.explanation ? paper.explanation.substring(0, 200) + '...' : 'No summary available',
      source: 'User Post',
      createdAt: paper.createdAt
    }));

    res.json({ papers: formattedPapers });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery', message: error.message });
  }
});

// Post paper to gallery (make it public)
router.post('/:paperId', authenticate, validateObjectId, async (req, res) => {
  try {
    const paper = await Paper.findOne({ 
      _id: req.params.paperId, 
      userId: req.userId 
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    paper.isPublic = true;
    if (req.body.category) {
      paper.category = req.body.category;
    }
    await paper.save();

    res.json({ 
      message: 'Paper posted to gallery successfully',
      paper: {
        id: paper._id.toString(),
        title: paper.filename,
        category: paper.category,
        isPublic: paper.isPublic
      }
    });
  } catch (error) {
    console.error('Post to gallery error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid paper ID format' });
    }
    res.status(500).json({ error: 'Failed to post to gallery', message: error.message });
  }
});

// Remove paper from gallery (make it private)
router.delete('/:paperId', authenticate, validateObjectId, async (req, res) => {
  try {
    const paper = await Paper.findOne({ 
      _id: req.params.paperId, 
      userId: req.userId 
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    paper.isPublic = false;
    await paper.save();

    res.json({ message: 'Paper removed from gallery successfully' });
  } catch (error) {
    console.error('Remove from gallery error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid paper ID format' });
    }
    res.status(500).json({ error: 'Failed to remove from gallery', message: error.message });
  }
});

export default router;
