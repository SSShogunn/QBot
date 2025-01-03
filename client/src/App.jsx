import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import AuthenticationPage from './pages/AuthenticationPage'
import NotFoundPage from './pages/NotFoundPage'
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/chat" element={
          <HomePage />
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
