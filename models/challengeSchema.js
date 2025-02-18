
const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true }, //"factorial",
  category: { type: String, required: true }, //"Math",
  description: { type: String, required: true }, //"### Problem Statement:\nCompute the factorial of a non-negative integer `n`.\n\n### Example:\nFor example, the factorial of `5` is `120`.",
  level: { type: String, required: true }, // Expected values: "Easy", "Moderate", "Hard"
  code: {
    function_name: String, //  "factorial",
    code_text: [   
      {
        language: String, 
        text: String,
      }
    ],
    inputs: [
      {
        name: { type: String }, 
        type: { type: String },
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

  solvedCount: { type: Number, default: 0 }, //for later
  attemptedCount: { type: Number, default: 0 } // for later
});

module.exports = mongoose.model('Challenge', ChallengeSchema);


