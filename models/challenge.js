
const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true },
  code: {
    function_name: String,
    code_text: [
      {
        language: String,
        text: String,
      }
    ],
    inputs: [
      {
        name: String,
        type: String,
      }
    ]
  },
  tests: [
    {
      weight: Number,
      inputs: [
        {
          name: String,
          value: mongoose.Mixed, 
        }
      ],
      output: mongoose.Mixed,
    }
  ],
  createdBy: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },

  solvedCount: { type: Number, default: 0 },
  attemptedCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
