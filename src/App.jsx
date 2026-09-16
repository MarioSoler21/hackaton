import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import { AnnouncerProvider } from './context/AnnouncerContext'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { ClientDashboard } from './pages/ClientDashboard'
import { ClientNewRequest } from './pages/ClientNewRequest'
import { ClientRequestDetail } from './pages/ClientRequestDetail'
import { AgentDashboard } from './pages/AgentDashboard'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <AnnouncerProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />

              <Route element={<AppLayout />}>
                <Route
                  path="/cliente"
                  element={
                    <ProtectedRoute role="cliente">
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cliente/nueva"
                  element={
                    <ProtectedRoute role="cliente">
                      <ClientNewRequest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cliente/solicitud/:id"
                  element={
                    <ProtectedRoute role="cliente">
                      <ClientRequestDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agente"
                  element={
                    <ProtectedRoute role="agente">
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnnouncerProvider>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  )
}
