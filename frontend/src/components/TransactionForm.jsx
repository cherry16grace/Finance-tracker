import { useState } from 'react';
import API from '../api/axios';

const INCOME_CATEGORIES  = ['Salary', 'Freelance', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Other'];

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: 'income',
    category: 'Salary',
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [msg, setMsg] = useState('');

  // ✅ When type changes, reset category to first option of that type
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setForm({
      ...form,
      type: newType,
      category: newType === 'income' ? 'Salary' : 'Food' // ✅ auto-switch category
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transactions', {
        ...form,
        amount: Number(form.amount) // ✅ convert to number before saving
      });
      setMsg('✅ Transaction added!');
      setForm({
        type: form.type,
        category: form.type === 'income' ? 'Salary' : 'Food',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
      });
      onAdd();
      setTimeout(() => setMsg(''), 2000);
    } catch { setMsg('❌ Failed to add'); }
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Add Transaction</h3>
      {msg && <p style={{ color: msg.includes('✅') ? 'green' : 'red', margin:'0 0 0.5rem' }}>{msg}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select style={styles.input} value={form.type} onChange={handleTypeChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* ✅ Categories now change based on type */}
        <select style={styles.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <input style={styles.input} type="number" placeholder="Amount (₹)"
          value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
        <input style={styles.input} type="date"
          value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        <input style={styles.input} placeholder="Note (optional)"
          value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
        <button style={styles.btn} type="submit">+ Add</button>
      </form>
    </div>
  );
}

const styles = {
  card:  { background:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  title: { color:'#2d6a4f', marginTop:0 },
  form:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' },
  input: { padding:'0.65rem', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px' },
  btn:   { gridColumn:'span 2', padding:'0.75rem', background:'#2d6a4f', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer' }
};