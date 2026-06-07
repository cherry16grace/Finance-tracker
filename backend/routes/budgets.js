const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Budget  = require('../models/Budget');

// GET all budgets for user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user });
    res.json(budgets);
  } catch { res.status(500).json({ msg: 'Server error' }); }
});

// SET or UPDATE budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    let budget = await Budget.findOne({ user: req.user, category, month });
    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = await Budget.create({ user: req.user, category, limit, month });
    }
    res.json(budget);
  } catch { res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;