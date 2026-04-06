import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import GeneratePage from './pages/GeneratePage';
import QRScanPage from './pages/QRScanPage';
import './index.css';

function App() {
    return (
        <Router>
            <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<GeneratePage />} />
                    <Route path="/qr/:qrId" element={<QRScanPage />} />
                </Routes>

                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: 'rgba(94,234,212,0.1)',
                            backdropFilter: 'blur(20px)',
                            color: '#F1F5F9',
                            borderRadius: '16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            padding: '14px 20px',
                            border: '1px solid rgba(94,234,212,0.15)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        },
                        success: {
                            iconTheme: { primary: '#5EEAD4', secondary: '#073B3A' },
                        },
                        error: {
                            iconTheme: { primary: '#EF4444', secondary: '#fff' },
                        },
                    }}
                />
            </div>
        </Router>
    );
}

export default App;
