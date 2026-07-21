import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Dashboard />
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(94,234,212,0.08)',
                        backdropFilter: 'blur(20px)',
                        color: '#F1F5F9',
                        borderRadius: '14px',
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '12px 18px',
                        border: '1px solid rgba(94,234,212,0.12)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    },
                    success: { iconTheme: { primary: '#5EEAD4', secondary: '#073B3A' } },
                    error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                }}
            />
        </div>
    );
}

export default App;
