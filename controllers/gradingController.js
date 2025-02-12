
const mockDatabase = {
    challenges: [
      {
        id: "65feaac34c7c0fa50a47fb3e",
        title: "factorial",
        category: "Math",
        description:
          "### Problem Statement:\nCompute the factorial of a non-negative integer `n`, denoted as `n!`. The factorial of `n` is the product of all positive integers less than or equal to `n`.\n\n### Example:\nFor example, the factorial of `5` is `5! = 5 * 4 * 3 * 2 * 1 = 120`.\n\n### Constraints:\n- The input `n` is a non-negative integer.\n- `0 <= n <= 20`.\n\n### Approach:\nA simple approach to compute the factorial of `n` is to use recursion. We define a recursive function `factorial(n)` that returns the factorial of `n`. The base case of the recursion is when `n` is `0` or `1`, in which case the factorial is `1`. Otherwise, we recursively compute the factorial of `n-1` and multiply it by `n`.\n\n### Implementation:\nTo implement this, we can define a recursive function `factorial(n)` that takes a non-negative integer `n` as input and returns its factorial. In the function, we handle the base case when `n` is `0` or `1`, and recursively call `factorial(n-1)` for other values of `n`. Finally, we return the product of `n` and the factorial of `n-1`.",
        level: "Hard",
        code: {
          function_name: "factorial",
          code_text: [
            {
              language: "py",
              text: "def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    return n * factorial(n - 1)"
            },
            {
              language: "js",
              text: "function factorial(n) {\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    return n * factorial(n - 1);\n}"
            }
          ],
          inputs: [
            {
              name: "n",
              type: "number"
            }
          ]
        },
        tests: [
          {
            weight: 0.8,
            inputs: [
              {
                name: "n",
                value: 5
              }
            ],
            output: 120
          },
          {
            weight: 0.2,
            inputs: [
              {
                name: "n",
                value: 0
              }
            ],
            output: 1
          }
        ]
      }
    ]
  };
  
 

  // Mock grader function (this would typically be a call to a real code execution service)
const mockGrader = (code, lang, tests) => {
  const results = tests.map((test) => {
      const input = test.inputs[0].value; // Assume a single input for simplicity
      try {
          let result;
          if (lang === 'py') {
              // Mock Python execution
              eval(`function factorial(n) { ${code.replace('def factorial', 'return function')} }`);
              const result = factorial(input);
              return { passed: result === test.output };
          } else if (lang === 'js') {
              eval(`function factorial(n) { ${code.replace('def factorial', 'return function')} }`);
              eval(code);
              const result = factorial(input);
              return { passed: result === test.output };
          }
      } catch (error) {
          return { passed: false, error: error.message };
      }
  });

  if (results.every((result) => result.passed)) {
      return { status: 'success', message: 'All tests passed!' };
  } else {
      // Return failure message with details if some tests failed
      return {
          status: 'failed',
          message: 'Some tests failed',
          results: results,
      };
  }
};

// Submission handler
const submitCode = (req, res) => {
  const { challenge_id, lang, code } = req.body;

  // Find the challenge
  const challenge = mockDatabase.challenges.find((c) => c.id === challenge_id);
  if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
  }

  // Grade the submission
  const gradingResult = mockGrader(code, lang, challenge.tests);

  res.status(200).json(gradingResult);
};

module.exports = {
  submitCode,
};

// const mockDatabase = {
//   challenges: [
//       {
//           id: '65feaac34c7c0fa50a47fb3e',
//           title: 'factorial',
//           category: 'Math',
//           level: 'Hard',
//           tests: [
//               { inputs: [{ name: 'n', value: 5 }], output: 120 },
//               { inputs: [{ name: 'n', value: 0 }], output: 1 },
//           ],
//       },
//   ],
// };

// // Mock grader function (this would typically be a call to a real code execution service)
// const mockGrader = (code, lang, tests) => {
//   const results = tests.map((test) => {
//       const input = test.inputs[0].value; // Assume a single input for simplicity
//       try {
//           if (lang === 'py') {
//               // Mock Python execution
//               eval(`function factorial(n) { ${code.replace('def factorial', 'return function')} }`);
//               const result = factorial(input);
//               return { passed: result === test.output };
//           } else if (lang === 'js') {
//               // Mock JavaScript execution
//               eval(code);
//               const result = factorial(input);
//               return { passed: result === test.output };
//           }
//       } catch (error) {
//           return { passed: false, error: error.message };
//       }
//   });

//   return results.every((result) => result.passed)
//       ? { status: 'success', message: 'All tests passed!' }
//       : { status: 'failed', message: 'Some tests failed', results };
// };

// // Submission handler
// const submitCode = (req, res) => {
//   const { challenge_id, lang, code } = req.body;

//   // Find the challenge
//   const challenge = mockDatabase.challenges.find((c) => c.id === challenge_id);
//   if (!challenge) {
//       return res.status(404).json({ message: 'Challenge not found' });
//   }

//   // Grade the submission
//   const gradingResult = mockGrader(code, lang, challenge.tests);

//   res.status(200).json(gradingResult);
// };

// module.exports = {
//   submitCode,
// };
