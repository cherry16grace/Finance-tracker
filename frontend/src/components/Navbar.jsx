import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activePage, setActivePage }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { key: 'dashboard', label: '🏠 Dashboard' },
    { key: 'transactions', label: '💸 Transactions' },
    { key: 'budget', label: '📊 Budget' },
    { key: 'ai', label: '🤖 AI Advisor' },
  ];

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>💰 Finance Tracker</h2>
      <div style={styles.links}>
        {navItems.map(item => (
          <button key={item.key}
            style={{ ...styles.link, ...(activePage === item.key ? styles.activeLink : {}) }}
            onClick={() => setActivePage(item.key)}>
            {item.label}
          </button>
        ))}
      </div>
      <div style={styles.right}>
        <span style={styles.username}>👤 {user?.name}</span>
        <button style={styles.btn} onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav:        { display:'flex', alignItems:'center', justifyContent:'space-between', background:'#2d6a4f', padding:'0 2rem', height:'64px', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 10px rgba(0,0,0,0.2)' },
  logo:       { color:'white', margin:0, fontSize:'20px', whiteSpace:'nowrap' },
  links:      { display:'flex', gap:'0.25rem' },
  link:       { background:'transparent', color:'rgba(255,255,255,0.8)', border:'none', padding:'0.5rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'500', transition:'all 0.2s' },
  activeLink: { background:'rgba(255,255,255,0.2)', color:'white' },
  right:      { display:'flex', alignItems:'center', gap:'1rem' },
  username:   { color:'rgba(255,255,255,0.8)', fontSize:'14px' },
  btn:        { background:'white', color:'#2d6a4f', border:'none', padding:'0.5rem 1rem', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'14px' }
};