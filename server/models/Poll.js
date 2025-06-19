// server/models/Poll.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      correctAnswer: Boolean
    }
  ],
  responses: [{
    studentName: String,
    answer: String,
  }],
  isActive: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now },
  duration: {
    type: Number,
    default: 60
  }
});

module.exports = mongoose.model('Poll', pollSchema);
