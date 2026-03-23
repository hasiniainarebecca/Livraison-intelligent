import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import ProtectedRoute from './components/Common/ProtectedRoute'
import NavBar from './components/Common/NavBar'

// Auth
import LoginForm    from './components/Auth/LoginForm'
import RegisterForm from './components/Auth/RegisterForm'
import Logout from './components/Auth/Logout'

// Public
import Catalog from './components/Public/Catalog'

// Client
import OrderList  from './components/Client/OrderList'
import CreateOrder from './components/Client/CreateOrder'
import TrackOrder  from './components/Client/TrackOrder'

// Livreur
import MissionList   from './components/Livreur/MissionList'
import MissionDetail from './components/Livreur/MissionDetail'

// Admin
import AdminDashboard  from './components/Admin/Dashboard'
import CategoryManager from './components/Admin/CategoryManager'
import ProductManager  from './components/Admin/ProductManager'
import StockManager   from './components/Admin/StockManager'
import UserManager     from './components/Admin/UserManager'

// Stripe (chargé une seule fois)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK ?? '')

// Wrappers pour les params d'URL
function TrackOrderWrapper() { const { id } = useParams(); return <TrackOrder orderId={id} /> }

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>
  if (!user)   return <Navigate to="/catalog" replace />
  const redirects = {
    client:  '/client/orders',
    livreur: '/livreur',
    admin:   '/admin',
  }
  return <Navigate to={redirects[user.role] ?? '/catalog'} replace />
}

// Layout avec NavBar — uniquement pour les utilisateurs connectés
function AppLayout({ children }) {
  const { user } = useAuth()
  return (
    <>
      {user && <NavBar />}
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Racine */}
                <Route path="/" element={<RootRedirect />} />

                {/* Auth (public) */}
                <Route path="/login"    element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/logout" element={<Logout />} />

                {/* Catalogue public (sans connexion) */}
                <Route path="/catalog" element={<Catalog />} />

                {/* ── Client ─────────────────────────────────────────────────── */}
                <Route path="/client" element={
                  <ProtectedRoute roles={['client']}>
                    <Navigate to="/client/orders" replace />
                  </ProtectedRoute>
                } />
                <Route path="/client/orders" element={
                  <ProtectedRoute roles={['client']}><OrderList /></ProtectedRoute>
                } />
                <Route path="/client/orders/new" element={
                  <ProtectedRoute roles={['client']}><CreateOrder /></ProtectedRoute>
                } />
                <Route path="/client/orders/:id/track" element={
                  <ProtectedRoute roles={['client']}><TrackOrderWrapper /></ProtectedRoute>
                } />

                {/* ── Livreur ────────────────────────────────────────────────── */}
                <Route path="/livreur" element={
                  <ProtectedRoute roles={['livreur']}><MissionList /></ProtectedRoute>
                } />
                <Route path="/livreur/missions/:id" element={
                  <ProtectedRoute roles={['livreur']}><MissionDetail /></ProtectedRoute>
                } />

                {/* ── Admin React (mobile) ────────────────────────────────────── */}
                <Route path="/admin" element={
                  <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                  <ProtectedRoute roles={['admin']}><CategoryManager /></ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute roles={['admin']}><ProductManager /></ProtectedRoute>
                } />
                <Route path="/admin/stocks" element={
                  <ProtectedRoute roles={['admin']}><StockManager /></ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute roles={['admin']}><UserManager /></ProtectedRoute>
                } />

                {/* Erreurs */}
                <Route path="/unauthorized" element={<h1 style={{ textAlign: 'center', marginTop: 80 }}>403 — Accès non autorisé</h1>} />
                <Route path="*"             element={<h1 style={{ textAlign: 'center', marginTop: 80 }}>404 — Page introuvable</h1>} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </Elements>
      </AuthProvider>
    </CartProvider>
  )
}
