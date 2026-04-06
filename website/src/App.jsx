import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import QRScanPage from './pages/QRScanPage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/qr/:qrId" element={<QRScanPage />} />
      </Routes>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0A1F1E',
            color: '#E2E8F0',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 600,
            padding: '14px 20px',
            border: '1px solid rgba(94,234,212,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
        }}
      />
    </Router>
  )
}

export default App
