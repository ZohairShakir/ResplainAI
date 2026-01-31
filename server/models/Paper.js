import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  ageLevel: {
    type: String,
    enum: ['preschool', 'middleschool', 'college', 'professional'],
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Paper', paperSchema);
