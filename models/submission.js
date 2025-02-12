
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  coderId: { type: String, required: true },
  passed: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
