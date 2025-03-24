const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      minlength: [10, 'Note content must be at least 10 characters long'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
