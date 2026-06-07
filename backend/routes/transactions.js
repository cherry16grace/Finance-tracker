const router      = require('express').Router();
const auth        = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// GET all transactions for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.user }).sort({ date: -1 });
    res.json(txns);
  } catch { res.status(500).json({ msg: 'Server error' }); }
});

// ADD transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const txn = await Transaction.create({ user: req.user, type, category, amount, note, date });
    res.json(txn);
  } catch { res.status(500).json({ msg: 'Server error' }); }
});

// UPDATE transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const txn = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!txn) return res.status(404).json({ msg: 'Not found' });
    res.json(txn);
  } catch { res.status(500).json({ msg: 'Server error' }); }
});

// DELETE transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const txn = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!txn) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted' });
  } catch { res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;