import './App.css'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
