import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import api from '../../api/axios'
import { useCart } from '../../contexts/CartContext'
import ProductList from './ProductList'

/**
 * Processus de création en 3 étapes :
 *   Étape 1 — Sélectionner les produits (panier pré-rempli depuis CartContext)
 *   Étape 2 — Saisir les adresses et valider
 *   Étape 3 — Paiement Stripe
 */
export default function CreateOrder() {
  const navigate  = useNavigate()
  const stripe    = useStripe()
  const elements  = useElements()
  const { cart: ctxCart, clearCart } = useCart()

  const [step, setStep]     = useState(1)
  const [cart, setCart]     = useState([])
  const [form, setForm]     = useState({ type: 'standard', pickup_address: '', delivery_address: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading]       = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError]     = useState(null)

  // Pré-remplir le panier depuis CartContext si disponible
  useEffect(() => {
    if (ctxCart.length > 0 && cart.length === 0) {
      setCart(ctxCart)
    }
  }, [ctxCart])

  const totalPrice = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  // ── Gestion panier local ──────────────────────────────────────────────────────

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id)
      if (exists) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => setCart((prev) => prev.filter((i) => i.product.id !== productId))

  const changeQty = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId)
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i))
  }

  // ── Étape 2 → 3 : créer le PaymentIntent ──────────────────────────────────────

  const handleToPayment = async () => {
    if (!form.pickup_address || !form.delivery_address) {
      setErrors({ _: ['Veuillez renseigner les adresses.'] })
      return
    }
    setErrors({})
    setStripeLoading(true)
    try {
      const amountCents = Math.round(totalPrice * 100)
      const { data } = await api.post('/client/payment/create-intent', { amount: amountCents })
      setClientSecret(data.client_secret)
      setStep(3)
    } catch (err) {
      setErrors({ _: [err.response?.data?.message ?? 'Impossible de préparer le paiement.'] })
    } finally {
      setStripeLoading(false)
    }
  }

  // ── Étape 3 : confirmer Stripe + créer la commande ───────────────────────────

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setStripeError(null)

    // 1. Confirmer le paiement côté Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      setStripeError(error.message)
      setLoading(false)
      return
    }

    if (paymentIntent?.status !== 'succeeded') {
      setStripeError('Le paiement n\'a pas été validé.')
      setLoading(false)
      return
    }

    // 2. Créer la commande avec le payment_intent_id
    try {
      await api.post('/client/orders', {
        ...form,
        items: cart.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        payment_intent_id: paymentIntent.id,
      })
      clearCart()
      navigate('/client/orders')
    } catch (err) {
      setStripeError(err.response?.data?.message ?? 'Erreur lors de la création de la commande.')
    } finally {
      setLoading(false)
    }
  }

  // ── Styles partagés ───────────────────────────────────────────────────────────

  const stepLabels = ['Produits', 'Adresses', 'Paiement']

  return (
    <div style={s.page}>
      <h2 style={s.title}>Nouvelle commande</h2>

      {/* Indicateur d'étapes */}
      <div style={s.stepper}>
        {stepLabels.map((label, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ ...s.stepDot, ...(step > idx + 1 ? s.stepDone : step === idx + 1 ? s.stepActive : {}) }}>
              {step > idx + 1 ? '✓' : idx + 1}
            </div>
            <span style={{ ...s.stepLabel, ...(step === idx + 1 ? { color: '#3B82F6', fontWeight: 700 } : {}) }}>
              {label}
            </span>
            {idx < stepLabels.length - 1 && <div style={s.stepLine} />}
          </div>
        ))}
      </div>

      {/* ── ÉTAPE 1 : Produits ── */}
      {step === 1 && (
        <div>
          <ProductList onAddToCart={addToCart} cart={cart} />

          {cart.length > 0 && (
            <div style={s.cartSummary}>
              <h3 style={s.cartTitle}>🛒 Panier</h3>
              {cart.map((i) => (
                <div key={i.product.id} style={s.cartItem}>
                  <span style={{ flex: 1 }}>{i.product.name}</span>
                  <div style={s.qtyCtrl}>
                    <button style={s.qBtn} onClick={() => changeQty(i.product.id, i.quantity - 1)}>−</button>
                    <span style={{ minWidth: 24, textAlign: 'center' }}>{i.quantity}</span>
                    <button style={s.qBtn} onClick={() => changeQty(i.product.id, i.quantity + 1)}>+</button>
                  </div>
                  <span style={s.itemPrice}>{(i.product.price * i.quantity).toFixed(2)} €</span>
                  <button style={s.removeBtn} onClick={() => removeFromCart(i.product.id)}>✕</button>
                </div>
              ))}
              <div style={s.total}>
                <span>Total estimé</span>
                <strong style={{ fontSize: 18 }}>{totalPrice.toFixed(2)} €</strong>
              </div>
              <button style={s.nextBtn} onClick={() => setStep(2)}>
                Continuer → Adresses
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ÉTAPE 2 : Adresses ── */}
      {step === 2 && (
        <div style={s.formCard}>
          {errors._ && <div style={s.errorBox}>{errors._[0]}</div>}

          <div style={s.field}>
            <label style={s.label}>Type de livraison</label>
            <select style={s.select} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="standard">Standard</option>
              <option value="express">Express (+coût)</option>
            </select>
          </div>

          <div style={s.field}>
            <label style={s.label}>Adresse d'enlèvement *</label>
            <input style={s.input} type="text" value={form.pickup_address}
              onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              required placeholder="Ex : 12 rue Colbert, Antananarivo" />
          </div>

          <div style={s.field}>
            <label style={s.label}>Adresse de livraison *</label>
            <input style={s.input} type="text" value={form.delivery_address}
              onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
              required placeholder="Ex : 45 av. de l'Indépendance, Antananarivo" />
          </div>

          <div style={s.field}>
            <label style={s.label}>Notes pour le livreur</label>
            <textarea style={{ ...s.input, resize: 'vertical' }} rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Instructions particulières..." />
          </div>

          {/* Récapitulatif */}
          <div style={s.recap}>
            <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#6B7280' }}>Récapitulatif</h4>
            {cart.map((i) => (
              <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                <span>{i.product.name} × {i.quantity}</span>
                <span>{(i.product.price * i.quantity).toFixed(2)} €</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: 8, paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <span>Total</span><span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>

          <div style={s.actions}>
            <button style={s.backBtn} onClick={() => setStep(1)}>← Panier</button>
            <button style={s.nextBtn} onClick={handleToPayment} disabled={stripeLoading}>
              {stripeLoading ? 'Préparation...' : 'Payer →'}
            </button>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 3 : Stripe ── */}
      {step === 3 && clientSecret && (
        <div style={s.formCard}>
          <h3 style={{ marginTop: 0 }}>💳 Paiement sécurisé</h3>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Montant à régler : <strong>{totalPrice.toFixed(2)} €</strong></p>

          <form onSubmit={handlePay}>
            <div style={{ marginBottom: 20 }}>
              <PaymentElement />
            </div>

            {stripeError && <div style={s.errorBox}>{stripeError}</div>}

            <div style={s.actions}>
              <button type="button" style={s.backBtn} onClick={() => setStep(2)}>← Retour</button>
              <button type="submit" style={s.nextBtn} disabled={loading || !stripe}>
                {loading ? 'Traitement...' : `Payer ${totalPrice.toFixed(2)} €`}
              </button>
            </div>
          </form>

          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 16 }}>
            🔒 Paiement sécurisé par Stripe · Données cryptées
          </p>
        </div>
      )}
    </div>
  )
}

const s = {
  page:  { maxWidth: 720, margin: '0 auto', padding: 20, fontFamily: 'system-ui, sans-serif' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },

  stepper:    { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 },
  stepDot:    { width: 28, height: 28, borderRadius: '50%', background: '#E5E7EB', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 },
  stepActive: { background: '#3B82F6', color: '#fff' },
  stepDone:   { background: '#10B981', color: '#fff' },
  stepLabel:  { marginLeft: 6, fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' },
  stepLine:   { width: 24, height: 2, background: '#E5E7EB', margin: '0 6px' },

  cartSummary: { background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20, marginTop: 20 },
  cartTitle:   { margin: '0 0 16px', fontSize: 16 },
  cartItem:    { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F3F4F6' },
  qtyCtrl:     { display: 'flex', alignItems: 'center', gap: 6 },
  qBtn:        { width: 26, height: 26, borderRadius: 6, border: '1px solid #D1D5DB', background: '#F9FAFB', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  itemPrice:   { fontWeight: 700, minWidth: 70, textAlign: 'right' },
  removeBtn:   { background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14 },
  total:       { display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 4 },
  nextBtn:     { background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },

  formCard: { background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 },
  field:    { marginBottom: 16 },
  label:    { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input:    { width: '100%', padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
  select:   { width: '100%', padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14 },
  recap:    { background: '#F9FAFB', borderRadius: 8, padding: 16, marginTop: 16, marginBottom: 20 },

  actions:  { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  backBtn:  { background: 'none', border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', color: '#6B7280', fontSize: 14 },
  errorBox: { background: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
}
