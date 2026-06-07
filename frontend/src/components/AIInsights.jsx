import { useState } from 'react';
import API from '../api/axios';

const tabs = [
  { key: 'insights',       label: '💡 Spending Insights',  endpoint: '/ai/insights',       field: 'insight'   },
  { key: 'anomalies',      label: '🚨 Anomaly Detection',  endpoint: '/ai/anomalies',      field: 'anomalies' },
  { key: 'monthly-report', label: '📋 Monthly Report',     endpoint: '/ai/monthly-report', field: 'report'    },
];

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('insights');
  const [result, setResult]       = useState('');
  const [loading, setLoading]     = useState(false);

  const fetchInsight = async (endpoint, field) => {
    setLoading(true);
    setResult('');
    try {
      const { data } = await API.get(endpoint);
      setResult(data[field]);
    } catch {
      setResult('❌ Failed to get AI response. Check your API key.');
    }
    setLoading(false);
  };

  const active = tabs.find(t => t.key === activeTab);

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>🤖 AI Financial Advisor</h3>
        <span style={styles.badge}>Powered by Claude</span>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button key={tab.key}
            style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
            onClick={() => { setActiveTab(tab.key); setResult(''); }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p style={styles.desc}>
        {activeTab === 'insights'       && 'Get personalized spending insights based on your transaction history.'}
        {activeTab === 'anomalies'      && 'Detect unusual spending patterns and get alerted to anomalies.'}
        {activeTab === 'monthly-report' && 'Get a complete financial summary report for this month.'}
      </p>

      {/* Button */}
      <button
        style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
        onClick={() => fetchInsight(active.endpoint, active.field)}
        disabled={loading}>
        {loading ? '🤖 Analyzing your finances...' : `Generate ${active.label}`}
      </button>

      {/* Result */}
      {result && (
        <div style={styles.result}>
          {result.split('\n').map((line, i) => (
            <p key={i} style={{ margin: '0.4rem 0', lineHeight: '1.6' }}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card:      { background:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' },
  title:     { color:'#2d6a4f', margin:0 },
  badge:     { background:'#e8f5e9', color:'#2d6a4f', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold' },
  tabs:      { display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' },
  tab:       { padding:'0.5rem 1rem', border:'2px solid #e0e0e0', borderRadius:'8px', background:'white', cursor:'pointer', fontSize:'13px', fontWeight:'500' },
  tabActive: { borderColor:'#2d6a4f', background:'#e8f5e9', color:'#2d6a4f' },
  desc:      { color:'#888', fontSize:'14px', marginBottom:'1rem' },
  btn:       { padding:'0.75rem 1.5rem', background:'#2d6a4f', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer', width:'100%' },
  result:    { marginTop:'1.25rem', background:'#f8fffe', border:'1px solid #c8e6c9', borderRadius:'8px', padding:'1rem', fontSize:'14px', color:'#333' }
};