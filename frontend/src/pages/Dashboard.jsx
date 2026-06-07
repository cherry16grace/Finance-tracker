import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetTracker from '../components/BudgetTracker';
import AIInsights from '../components/AIInsights';

// ── Summary Cards (shown on home) ─────────────────────────────────
import { useEffect } from 'react';
import API from '../api/axios';

function HomePage({ onNavigate }) {
  const [stats, setStats] = useState({ income:0, expense:0, balance:0, count:0 });

  useEffect(() => {
    API.get('/transactions').then(({ data }) => {
      const income  = data.filter(t => t.type==='income').reduce((s,t)=>s+t.amount,0);
      const expense = data.filter(t => t.type==='expense').reduce((s,t)=>s+t.amount,0);
      setStats({ income, expense, balance: income-expense, count: data.length });
    });
  }, []);

  const cards = [
    { label:'Total Balance',  value:`₹${stats.balance.toLocaleString()}`,  color:'#2d6a4f', bg:'#e8f5e9', icon:'💰' },
    { label:'Total Income',   value:`₹${stats.income.toLocaleString()}`,   color:'#1565c0', bg:'#e3f2fd', icon:'📈' },
    { label:'Total Expenses', value:`₹${stats.expense.toLocaleString()}`,  color:'#c62828', bg:'#ffebee', icon:'📉' },
    { label:'Transactions',   value:stats.count,                           color:'#6a1b9a', bg:'#f3e5f5', icon:'🧾' },
  ];

  const quickActions = [
    { label:'➕ Add Transaction', page:'transactions' },
    { label:'📊 Set Budget',      page:'budget'       },
    { label:'🤖 AI Insights',     page:'ai'           },
  ];

  return (
    <div>
      <h2 style={styles.pageTitle}>Overview</h2>

      {/* Summary Cards */}
      <div style={styles.cardGrid}>
        {cards.map(c => (
          <div key={c.label} style={{ ...styles.statCard, background: c.bg, borderLeft:`4px solid ${c.color}` }}>
            <span style={{ fontSize:'2rem' }}>{c.icon}</span>
            <div>
              <p style={{ margin:0, color:'#666', fontSize:'13px' }}>{c.label}</p>
              <h3 style={{ margin:0, color: c.color, fontSize:'22px' }}>{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={styles.sectionTitle}>Quick Actions</h3>
      <div style={styles.actionGrid}>
        {quickActions.map(a => (
          <button key={a.page} style={styles.actionBtn} onClick={() => onNavigate(a.page)}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div style={styles.tipBox}>
        <h4 style={{ margin:'0 0 0.5rem', color:'#2d6a4f' }}>💡 Pro Tips</h4>
        <p style={{ margin:'0.25rem 0', fontSize:'14px', color:'#555' }}>• Set monthly budgets to control overspending</p>
        <p style={{ margin:'0.25rem 0', fontSize:'14px', color:'#555' }}>• Use AI Advisor to get personalized spending insights</p>
        <p style={{ margin:'0.25rem 0', fontSize:'14px', color:'#555' }}>• Check anomaly detection weekly to spot unusual spending</p>
      </div>
    </div>
  );
}

// ── Transactions Page ─────────────────────────────────────────────
function TransactionsPage() {
  const [refresh, setRefresh] = useState(false);
  return (
    <div>
      <h2 style={styles.pageTitle}>Transactions</h2>
      <TransactionForm onAdd={() => setRefresh(!refresh)} />
      <TransactionList refresh={refresh} />
    </div>
  );
}

// ── Budget Page ───────────────────────────────────────────────────
function BudgetPage() {
  const [refresh] = useState(false);
  return (
    <div>
      <h2 style={styles.pageTitle}>Budget Tracker</h2>
      <BudgetTracker refresh={refresh} />
    </div>
  );
}

// ── AI Page ───────────────────────────────────────────────────────
function AIPage() {
  return (
    <div>
      <h2 style={styles.pageTitle}>AI Financial Advisor</h2>
      <AIInsights />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch(activePage) {
      case 'transactions': return <TransactionsPage />;
      case 'budget':       return <BudgetPage />;
      case 'ai':           return <AIPage />;
      default:             return <HomePage onNavigate={setActivePage} />;
    }
  };

  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem' }}>
        {renderPage()}
      </div>
    </div>
  );
}

const styles = {
  pageTitle:   { color:'#2d6a4f', marginTop:0, marginBottom:'1.5rem', fontSize:'24px' },
  sectionTitle:{ color:'#333', marginBottom:'1rem' },
  cardGrid:    { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' },
  statCard:    { display:'flex', alignItems:'center', gap:'1rem', padding:'1.25rem', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  actionGrid:  { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' },
  actionBtn:   { padding:'1rem', background:'white', border:'2px solid #e0e0e0', borderRadius:'12px', cursor:'pointer', fontSize:'15px', fontWeight:'600', color:'#333', transition:'all 0.2s' },
  tipBox:      { background:'white', padding:'1.25rem', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
};