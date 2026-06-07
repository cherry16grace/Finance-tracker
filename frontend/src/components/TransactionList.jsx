import { useEffect, useState } from 'react';
import API from '../api/axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#2d6a4f','#52b788','#ff6b6b','#ffa94d','#748ffc','#da77f2','#63e6be','#ffd43b','#a9e34b'];

export default function TransactionList({ refresh }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get('/transactions').then(({ data }) => setTransactions(data));
  }, [refresh]);

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    setTransactions(transactions.filter(t => t._id !== id));
  };

  const total    = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense  = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Pie chart — expenses by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Bar chart — income vs expense by month
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    acc[month][t.type] += t.amount;
    return acc;
  }, {});
  const barData = Object.values(monthlyData);

  return (
    <div>
      {/* Summary Cards */}
      <div style={styles.cards}>
        <div style={{...styles.card, borderTop: '4px solid #2d6a4f'}}>
          <p style={styles.cardLabel}>Total Balance</p>
          <h2 style={{ color: total >= 0 ? '#2d6a4f' : 'red' }}>₹{total.toLocaleString()}</h2>
        </div>
        <div style={{...styles.card, borderTop: '4px solid #52b788'}}>
          <p style={styles.cardLabel}>Total Income</p>
          <h2 style={{ color: '#52b788' }}>₹{income.toLocaleString()}</h2>
        </div>
        <div style={{...styles.card, borderTop: '4px solid #ff6b6b'}}>
          <p style={styles.cardLabel}>Total Expenses</p>
          <h2 style={{ color: '#ff6b6b' }}>₹{expense.toLocaleString()}</h2>
        </div>
      </div>

      {/* Charts */}
      {transactions.length > 0 && (
        <div style={styles.chartsRow}>
          {/* Pie Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Expenses by Category</h3>
            <PieChart width={300} height={250}>
              <Pie data={pieData} cx={150} cy={110} outerRadius={90} dataKey="value" label={({ name }) => name}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income"  fill="#52b788" radius={[4,4,0,0]} />
                <Bar dataKey="expense" fill="#ff6b6b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div style={styles.listCard}>
        <h3 style={styles.chartTitle}>All Transactions</h3>
        {transactions.length === 0 && <p style={{ color:'#888' }}>No transactions yet!</p>}
        {transactions.map(t => (
          <div key={t._id} style={styles.item}>
            <div>
              <span style={{...styles.badge, background: t.type==='income'?'#d4edda':'#f8d7da', color: t.type==='income'?'#155724':'#721c24'}}>
                {t.type}
              </span>
              <strong style={{ marginLeft:'0.5rem' }}>{t.category}</strong>
              {t.note && <span style={{ color:'#888', fontSize:'13px' }}> — {t.note}</span>}
              <span style={{ color:'#aaa', fontSize:'12px', marginLeft:'0.5rem' }}>
                {new Date(t.date).toLocaleDateString()}
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <span style={{ color: t.type==='income'?'green':'red', fontWeight:'bold' }}>
                {t.type==='income'?'+':'-'}₹{t.amount.toLocaleString()}
              </span>
              <button onClick={() => handleDelete(t._id)} style={styles.del}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  cards:      { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' },
  card:       { background:'white', padding:'1.25rem', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', textAlign:'center' },
  cardLabel:  { color:'#888', margin:'0 0 0.5rem', fontSize:'14px' },
  chartsRow:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' },
  chartCard:  { background:'white', padding:'1.25rem', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  chartTitle: { color:'#2d6a4f', marginTop:0, marginBottom:'1rem' },
  listCard:   { background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  item:       { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 0', borderBottom:'1px solid #f0f0f0' },
  badge:      { padding:'2px 8px', borderRadius:'12px', fontSize:'12px', fontWeight:'bold' },
  del:        { background:'#ff4d4d', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', padding:'2px 8px' }
};