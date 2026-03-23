import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import CartDrawer from './CartDrawer'

const LINKS = {
  admin: [
    { to: '/admin',             label: '📊 Tableau de bord' },
    { to: '/admin/categories',  label: '🗂 Catégories' },
    { to: '/admin/products',    label: '📦 Produits' },
    { to: '/admin/stocks',      label: '🏭 Stocks' },
    { to: '/admin/users',       label: '👥 Utilisateurs' },
  ],
  livreur: [
    { to: '/livreur', label: '📋 Mes missions' },
  ],
  client: [
    { to: '/catalog',           label: '🛍 Catalogue' },
    { to: '/client/orders',     label: '📜 Mes commandes' },
  ],
}

export default function NavBar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)

  if (!user) return null

  const links = LINKS[user.role] ?? []

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <nav style={n.bar}>
        <div style={n.brand}>
          <span style={n.logo}>🚪</span>
          <span style={n.appName}>Porte Ouverte</span>
        </div>

        <div style={n.links}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/livreur'}
              style={({ isActive }) => ({
                ...n.link,
                ...(isActive ? n.linkActive : {}),
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div style={n.userZone}>
          {/* Icône panier pour les clients */}
          {user.role === 'client' && (
            <button style={n.cartBtn} onClick={() => setCartOpen(true)}>
              🛒
              {totalItems > 0 && <span style={n.cartBadge}>{totalItems}</span>}
            </button>
          )}
          <span style={n.userName}>{user.name}</span>
          <span style={n.roleBadge}>{user.role}</span>
          <button style={n.logoutBtn} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      {user.role === 'client' && (
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      )}
    </>
  )
}

const n = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    background: '#1E293B',
    color: '#fff',
    padding: '0 16px',
    height: 56,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginRight: 24,
    textDecoration: 'none',
  },
  logo:    { fontSize: 22 },
  appName: { fontWeight: 700, fontSize: 16, color: '#F1F5F9', whiteSpace: 'nowrap' },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    overflowX: 'auto',
  },
  link: {
    color: '#94A3B8',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transition: 'background 0.15s, color 0.15s',
  },
  linkActive: {
    background: '#3B82F6',
    color: '#fff',
  },

  userZone: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  cartBtn: {
    background: 'none', border: '1px solid #475569', color: '#CBD5E1',
    borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
    fontSize: 18, position: 'relative', display: 'flex', alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute', top: -6, right: -6,
    background: '#EF4444', color: '#fff', borderRadius: '50%',
    width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700,
  },
  userName: { fontSize: 13, color: '#CBD5E1', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  roleBadge: {
    fontSize: 11,
    background: '#334155',
    color: '#94A3B8',
    padding: '2px 8px',
    borderRadius: 99,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #475569',
    color: '#94A3B8',
    padding: '4px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
  },
}
