import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import DealershipMarketing from './pages/DealershipMarketing'
import CarRentalMarketing from './pages/CarRentalMarketing'
import DriveFlowAI from './pages/DriveFlowAI'
import DealerSync from './pages/DealerSync'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PrivacyPolicy from './pages/PrivacyPolicy'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="bg-charcoal text-white min-h-screen overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dealership-marketing" element={<DealershipMarketing />} />
          <Route path="/car-rental-marketing" element={<CarRentalMarketing />} />
          <Route path="/drive-flow-ai" element={<DriveFlowAI />} />
          <Route path="/dealer-sync" element={<DealerSync />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
