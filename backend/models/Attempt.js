const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    puzzleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Puzzle",
      required: true,
    },
    attemptsCount: {
      type: Number,
      default: 0,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    solvedAt: {
      type: Date,
    },
    hintUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

attemptSchema.index({ userId: 1, puzzleId: 1 }, { unique: true });

module.exports = mongoose.model("Attempt", attemptSchema);
