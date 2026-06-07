const router = require('express').Router();
const auth   = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const askGroq = async (prompt) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages:   [{ role: 'user', content: prompt }],
      max_tokens: 1024
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
};

// ─── 1. Spending Insights ────────────────────────────────────────────
router.get('/insights', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user });
    if (transactions.length === 0)
      return res.json({ insight: 'Add some transactions first to get AI insights!' });

    const summary = transactions.map(t =>
      `${t.type} | ${t.category} | ₹${t.amount} | ${new Date(t.date).toDateString()}`
    ).join('\n');

    const prompt = `You are a personal finance advisor. Analyze these transactions and give 3-4 short, personalized spending insights and actionable tips. Be specific with numbers. Keep it friendly and concise.

Transactions:
${summary}

Respond in this format:
1. [insight]
2. [insight]
3. [insight]
4. [tip]`;

    const insight = await askGroq(prompt);
    res.json({ insight });
  } catch (err) {
    console.error('Insights error:', err.message);
    res.status(500).json({ msg: err.message || 'AI error' });
  }
});

// ─── 2. Anomaly Detection ────────────────────────────────────────────
router.get('/anomalies', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user });
    if (transactions.length < 3)
      return res.json({ anomalies: 'Add at least 3 transactions to detect anomalies.' });

    const summary = transactions.map(t =>
      `${t.type} | ${t.category} | ₹${t.amount} | ${new Date(t.date).toDateString()}`
    ).join('\n');

    const prompt = `You are a financial anomaly detector. Analyze these transactions and identify any unusual spending patterns, sudden spikes, or suspicious entries.

Transactions:
${summary}

Respond with:
- List any anomalies found (with amounts and dates)
- If none found, say "No anomalies detected — your spending looks normal!"
- Keep it under 5 bullet points`;

    const anomalies = await askGroq(prompt);
    res.json({ anomalies });
  } catch (err) {
    console.error('Anomaly error:', err.message);
    res.status(500).json({ msg: err.message || 'AI error' });
  }
});

// ─── 3. Monthly Summary Report ───────────────────────────────────────
router.get('/monthly-report', auth, async (req, res) => {
  try {
    const now       = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Transaction.find({
      user: req.user,
      date: { $gte: startDate, $lte: endDate }
    });

    if (transactions.length === 0)
      return res.json({ report: 'No transactions this month yet. Add some first!' });

    const income  = transactions.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
    const byCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => { acc[t.category] = (acc[t.category]||0) + t.amount; return acc; }, {});

    const prompt = `You are a financial advisor creating a monthly summary for ${now.toLocaleString('default', { month:'long', year:'numeric' })}.

Data:
- Total Income: ₹${income}
- Total Expenses: ₹${expense}
- Net Savings: ₹${income - expense}
- Expenses by category: ${JSON.stringify(byCategory)}

Write a friendly monthly financial summary with:
1. Overall financial health (1 sentence)
2. Top spending categories and what to watch
3. Savings rate analysis
4. 2 actionable recommendations for next month
Keep it under 150 words.`;

    const report = await askGroq(prompt);
    res.json({ report });
  } catch (err) {
    console.error('Monthly report error:', err.message);
    res.status(500).json({ msg: err.message || 'AI error' });
  }
});

module.exports = router;