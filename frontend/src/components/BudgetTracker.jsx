import { useState, useEffect } from 'react';
import API from '../api/axios';

const EXPENSE_CATEGORIES = ['Food','Rent','Transport','Shopping','Health','Entertainment','Other'];

export default function BudgetTracker({ refresh }) {
  const [budgets, setBudgets]           = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm]                 = useState({ category:'Food', limit:'', month: new Date().toISOString().slice(0,7) });
  const [msg, setMsg]                   = useState('');

  useEffect(() => {
    API.get('/budgets').then(({ data }) => setBudgets(data));
    API.get('/transactions').then(({ data }) => setTransactions(data));
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/budgets', form);
      const { data } = await API.get('/budgets');
      setBudgets(data);
      setMsg('✅ Budget set!');
      setTimeout(() => setMsg(''), 2000);
    } catch { setMsg('❌ Failed'); }
  };

 const getSpent = (category, month) => {
  return transactions
    .filter(t => {
      const txMonth = new Date(t.date).toISOString().slice(0, 7);
      return (
        t.type === 'expense' &&
        t.category.toLowerCase() === category.toLowerCase() && // ✅ case-insensitive
        txMonth === month
      );
    })
    .reduce((s, t) => s + t.amount, 0);
};
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Budget Tracker</h3>

      {/* Set Budget Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select style={styles.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input style={styles.input} type="number" placeholder="Budget limit (₹)"
          value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} required />
        <input style={styles.input} type="month"
          value={form.month} onChange={e => setForm({...form, month: e.target.value})} />
        <button style={styles.btn} type="submit">Set Budget</button>
      </form>
      {msg && <p style={{ color: msg.includes('✅') ? 'green' : 'red', fontSize:'14px' }}>{msg}</p>}

      {/* Budget Progress Bars */}
      <div style={{ marginTop:'1rem' }}>
        {budgets.map(b => {
          const spent   = getSpent(b.category, b.month);
          const pct     = Math.min((spent / b.limit) * 100, 100).toFixed(0);
          const color   = pct >= 100 ? '#ff4d4d' : pct >= 80 ? '#ffa94d' : '#52b788';
          return (
            <div key={b._id} style={{ marginBottom:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'4px' }}>
                <span><strong>{b.category}</strong> <span style={{ color:'#888', fontSize:'12px' }}>{b.month}</span></span>
                <span style={{ color }}>₹{spent.toLocaleString()} / ₹{b.limit.toLocaleString()} ({pct}%)</span>
              </div>
              <div style={{ background:'#f0f0f0', borderRadius:'8px', height:'10px' }}>
                <div style={{ width:`${pct}%`, background: color, borderRadius:'8px', height:'10px', transition:'width 0.3s' }} />
              </div>
              {pct >= 100 && <p style={{ color:'#ff4d4d', fontSize:'12px', margin:'4px 0 0' }}>⚠️ Budget exceeded!</p>}
              {pct >= 80 && pct < 100 && <p style={{ color:'#ffa94d', fontSize:'12px', margin:'4px 0 0' }}>🔶 Almost at limit!</p>}
            </div>
          );
        })}
        {budgets.length === 0 && <p style={{ color:'#888', fontSize:'14px' }}>No budgets set yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  card:  { background:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  title: { color:'#2d6a4f', marginTop:0 },
  form:  { display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'0.75rem', alignItems:'end' },
  input: { padding:'0.65rem', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px' },
  btn:   { padding:'0.65rem 1rem', background:'#2d6a4f', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', whiteSpace:'nowrap' }
};