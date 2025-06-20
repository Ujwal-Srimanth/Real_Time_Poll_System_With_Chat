const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  name: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
