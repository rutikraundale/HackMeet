import './App.css'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
