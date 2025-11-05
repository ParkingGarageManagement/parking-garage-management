import asyncHandler from 'express-async-handler';
import Feedback from '../models/feedbackModel.js';

// NEW: Create feedback
export const createFeedback = asyncHandler(async (req, res) => {
  const { name, rating, message } = req.body;

  if (!name || !rating || !message) {
    res.status(400);
    throw new Error('Please provide name, rating and message');
  }

  const feedback = await Feedback.create({ name, rating, message });

  res.status(201).json({ message: 'Feedback submitted', data: feedback });
});

// NEW: Get all feedbacks (admin)
export const getFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
  res.json({ data: feedbacks });
});
