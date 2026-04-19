

import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './context/ToastContext'

function App() {
  

  return (
    <ToastProvider>
      <AppRoutes/>
    </ToastProvider>
  
  )
}

export default App
