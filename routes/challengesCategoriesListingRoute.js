
const express = require('express');
const router = express.Router();
const Category = require('../models/categorySchema');


router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
