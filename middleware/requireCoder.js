module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  if (req.user.role !== "coder") {
    return res
      .status(403)
      .json({ error: "Only coders can submit code for grading." });
  }
  next();
};
