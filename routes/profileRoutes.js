const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
// Import your combined auth middleware which verifies JWT and checks allowed roles.
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Helper function to hash passwords
async function createPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * GET /profile
 * - Protected endpoint for both coders and managers.
 * - Returns the user's profile (excluding the password).
 * - If the user is a coder, calculates and includes the coder's rank based on total score.
 */
router.get(
  "/profile",
  authMiddleware(["coder", "manager"]), //endpoints are protected using auth.js Middleware(["coder", "manager"])
  async (req, res) => {
    try {
      // Retrieve the user's profile
      const user = await User.findById(req.user.id).select("-password"); //excluding the password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let rank;
      // If the coder is the entity who made the request then you should calculate the rank of the coder and add it to the response.
      if (user.role === "coder") {
        const countHigher = await User.countDocuments({
          role: "coder",
          score: { $gt: user.score },
        });
        rank = countHigher + 1;
      }

      res.json({ profile: user, ...(rank ? { rank } : {}) });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * PUT /profile
 * - Protected endpoint for both coders and managers to update their profile.
 * - Allows updating first_name, last_name, email, password, and description.
 */
router.put(
  "/profile",
  authMiddleware(["coder", "manager"]),  //endpoints are protected using auth.js Middleware(["coder", "manager"])
  async (req, res) => {
    try {
      const { first_name, last_name, email, password, description } = req.body; //Accepts updates for fields like first_name, last_name, email, password, and description (avatar later)
      const updateData = {};

      // Only update fields that are provided
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (email) updateData.email = email;
      if (description) updateData.description = description;
      if (password) {
        updateData.password = await createPassword(password);
      }

      // Update user and return the new profile (excluding the password)
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ profile: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
