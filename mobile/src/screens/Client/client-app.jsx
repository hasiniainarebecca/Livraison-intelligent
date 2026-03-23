import { useState, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        "#F7F4EF",
  bgDeep:    "#EDE9E2",
  white:     "#FFFFFF",
  card:      "#FFFFFF",
  primary:   "#1A6B4A",
  primaryLt: "#E8F5EF",
  accent:    "#E8793A",
  accentLt:  "#FDF0E8",
  text:      "#1C1917",
  sub:       "#78716C",
  muted:     "#A8A29E",
  border:    "#E7E4DF",
  green:     "#22C55E",
  red:       "#EF4444",
  blue:      "#3B82F6",
  yellow:    "#F59E0B",
};

const STATUS = {
  "En attente":   { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B", border: "#FDE68A" },
  "Confirmée":    { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6", border: "#BFDBFE" },
  "En cours":     { bg: "#E8F5EF", text: "#15803D", dot: "#22C55E", border: "#86EFAC" },
  "Livré":        { bg: "#F0FDF4", text: "#166534", dot: "#22C55E", border: "#BBF7D0" },
  "Annulé":       { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444", border: "#FECACA" },
};

const SCREENS = {
  HOME: "home", NEW_ORDER: "new_order", TRACKING: "tracking",
  ORDER_DETAIL: "order_detail", HISTORY: "history",
  PROFILE: "profile", NOTIFICATIONS: "notifications",
  CONFIRM: "confirm", RATE: "rate",
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const ORDERS = [
  {
    id: "CMD-5512", status: "En cours", type: "Express",
    address: "Lot IVN 45, Analamahitsy, Antananarivo",
    date: "Aujourd'hui, 14:20", eta: "12 min", progress: 75,
    items: [{ name: "Livre de cuisine", qty: 1, price: 25000 }, { name: "Épices mélangées", qty: 2, price: 8500 }],
    total: 42000, deliveryFee: 3500,
    driver: { name: "Toky Randria", rating: 4.8, phone: "+261 32 11 222 33", vehicle: "Moto Honda · MG-1234" },
    timeline: [
      { label: "Commande passée", time: "14:20", done: true },
      { label: "Confirmée", time: "14:23", done: true },
      { label: "Livreur en route", time: "14:31", done: true },
      { label: "Livraison", time: "~14:52", done: false },
    ],
  },
  {
    id: "CMD-5498", status: "Livré", type: "Standard",
    address: "Rue Pasteur, Isoraka, Antananarivo",
    date: "Hier, 11:15", eta: "—",
    items: [{ name: "Vêtements enfant", qty: 3, price: 35000 }],
    total: 105000, deliveryFee: 2000,
    driver: { name: "Ravo Hery", rating: 4.9, phone: "+261 34 44 555 66", vehicle: "Vélo cargo · —" },
    timeline: [
      { label: "Commande passée", time: "10:50", done: true },
      { label: "Confirmée", time: "10:55", done: true },
      { label: "Livreur en route", time: "11:10", done: true },
      { label: "Livré", time: "11:48", done: true },
    ],
  },
  {
    id: "CMD-5481", status: "Livré", type: "Standard",
    address: "Ankadimbahoaka, Antananarivo",
    date: "12 Jan, 09:00", eta: "—",
    items: [{ name: "Électronique", qty: 1, price: 180000 }],
    total: 180000, deliveryFee: 4500,
    driver: { name: "Mamy Andria", rating: 4.7, phone: "+261 33 77 888 99", vehicle: "Voiture · MG-5678" },
    timeline: [
      { label: "Commande passée", time: "08:30", done: true },
      { label: "Confirmée", time: "08:35", done: true },
      { label: "Livreur en route", time: "08:55", done: true },
      { label: "Livré", time: "09:42", done: true },
    ],
  },
];

// ─── Icon System ──────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const paths = {
    home:       <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    package:    <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    bell:       <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    user:       <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    history:    <><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5"/><polyline points="3 3 3 7 7 7"/></>,
    map:        <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    arrow:      <polyline points="9 18 15 12 9 6"/>,
    arrowLeft:  <polyline points="15 18 9 12 15 6"/>,
    check:      <polyline points="20 6 9 17 4 12"/>,
    location:   <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    truck:      <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    phone:      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.93 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>,
    star:       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    chat:       <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    close:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    lightning:  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    wallet:     <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="1"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    navigation: <polygon points="3 11 22 2 13 21 11 13 3 11"/>,
    edit:       <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    shield:     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    help:       <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, small = false }) => {
  const s = STATUS[status] || STATUS["En attente"];
  return (
    <span style={{
      background: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      borderRadius: 20,
      padding: small ? "2px 8px" : "4px 12px",
      fontSize: small ? 10 : 11,
      fontWeight: 700, letterSpacing: "0.04em",
      display: "inline-flex", alignItems: "center", gap: 5,
      textTransform: "uppercase",
    }}>
      <span style={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
};

// ─── Home Screen ──────────────────────────────────────────────────────────────
const HomeScreen = ({ onNavigate, onSelectOrder }) => {
  const active = ORDERS.filter(o => o.status === "En cours");
  const recent = ORDERS.filter(o => o.status === "Livré").slice(0, 2);

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 90 }}>
      {/* Hero Header */}
      <div style={{
        background: `linear-gradient(150deg, ${C.primary} 0%, #0F4A32 100%)`,
        padding: "52px 22px 28px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", top: 20, right: 30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0, letterSpacing: "0.08em" }}>BONJOUR 👋</p>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "4px 0 0", letterSpacing: "-0.5px" }}>Lalaina Rabe</h2>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => onNavigate(SCREENS.NOTIFICATIONS)} style={{
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12, width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative",
            }}>
              <Icon name="bell" size={18} color="#fff" />
              <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: C.accent, borderRadius: "50%", border: "2px solid #0F4A32" }} />
            </button>
            <div onClick={() => onNavigate(SCREENS.PROFILE)} style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, color: "#fff", fontSize: 16, cursor: "pointer",
            }}>L</div>
          </div>
        </div>

        {/* New Order Button */}
        <button onClick={() => onNavigate(SCREENS.NEW_ORDER)} style={{
          width: "100%",
          background: C.accent,
          border: "none", borderRadius: 16,
          padding: "16px 20px",
          display: "flex", alignItems: "center", gap: 14,
          cursor: "pointer",
          boxShadow: `0 8px 24px rgba(232,121,58,0.4)`,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="plus" size={24} color="#fff" />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 16, margin: 0 }}>Nouvelle commande</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0" }}>Express ou standard, livraison rapide</p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Icon name="arrow" size={20} color="rgba(255,255,255,0.8)" />
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ padding: "16px 22px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { emoji: "📦", value: "8", label: "Commandes" },
            { emoji: "✅", value: "6", label: "Livrées" },
            { emoji: "⭐", value: "4.9", label: "Ma note" },
          ].map(s => (
            <div key={s.label} style={{ background: C.card, borderRadius: 16, padding: "14px 10px", textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: 22, margin: 0 }}>{s.emoji}</p>
              <p style={{ color: C.text, fontWeight: 900, fontSize: 20, margin: "6px 0 2px" }}>{s.value}</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Order */}
      {active.length > 0 && (
        <div style={{ padding: "20px 22px 0" }}>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>🚚 Commande en cours</h3>
          {active.map(order => (
            <div key={order.id} onClick={() => { onSelectOrder(order); onNavigate(SCREENS.TRACKING); }}
              style={{
                background: `linear-gradient(135deg, ${C.primary}08, ${C.primary}04)`,
                border: `1.5px solid ${C.primary}30`,
                borderRadius: 20, padding: 18, cursor: "pointer",
                boxShadow: `0 4px 20px ${C.primary}12`,
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{order.id}</p>
                  <p style={{ color: C.text, fontSize: 17, fontWeight: 800, margin: "3px 0 0" }}>{order.items.map(i => i.name).join(", ")}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ color: C.sub, fontSize: 12, margin: 0 }}>Progression</p>
                  <p style={{ color: C.primary, fontSize: 12, fontWeight: 700, margin: 0 }}>{order.progress}%</p>
                </div>
                <div style={{ height: 8, background: C.bgDeep, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${order.progress}%`, background: `linear-gradient(90deg, ${C.primary}, #2D9B6B)`, borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: C.white, borderRadius: 12, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                  <p style={{ color: C.primary, fontWeight: 900, fontSize: 18, margin: 0 }}>{order.eta}</p>
                  <p style={{ color: C.muted, fontSize: 10, margin: "2px 0 0" }}>Arrivée estimée</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onSelectOrder(order); onNavigate(SCREENS.TRACKING); }}
                  style={{
                    flex: 2, background: C.primary, border: "none", borderRadius: 12,
                    color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                  <Icon name="map" size={15} color="#fff" />
                  Suivre en direct
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div style={{ padding: "20px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: C.text, fontSize: 15, fontWeight: 800, margin: 0 }}>Commandes récentes</h3>
          <button onClick={() => onNavigate(SCREENS.HISTORY)} style={{ background: "none", border: "none", color: C.primary, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Tout voir</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map(order => (
            <div key={order.id} onClick={() => { onSelectOrder(order); onNavigate(SCREENS.ORDER_DETAIL); }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: C.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="package" size={22} color={C.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: C.text, fontWeight: 700, fontSize: 14, margin: 0 }}>{order.id}</p>
                  <StatusBadge status={order.status} small />
                </div>
                <p style={{ color: C.muted, fontSize: 12, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.items.map(i => i.name).join(", ")}</p>
                <p style={{ color: C.muted, fontSize: 11, margin: "3px 0 0" }}>{order.date}</p>
              </div>
              <Icon name="arrow" size={16} color={C.muted} />
            </div>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div style={{ padding: "20px 22px 0" }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.accent}, #C45E25)`,
          borderRadius: 20, padding: "18px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: `0 6px 20px ${C.accent}30`,
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Offre spéciale</p>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 16, margin: "4px 0 4px" }}>Livraison gratuite</p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: 0 }}>Pour toute commande &gt; 50 000 MGA</p>
          </div>
          <div style={{ fontSize: 48 }}>🎁</div>
        </div>
      </div>
    </div>
  );
};

// ─── New Order Screen ─────────────────────────────────────────────────────────
const NewOrderScreen = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("standard");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 1 }]);
  const [note, setNote] = useState("");

  const suggestions = [
    "Lot IVN 45, Analamahitsy", "Rue Pasteur, Isoraka",
    "Ankadimbahoaka", "Tsaralalana, centre-ville", "Ambohimanarina",
  ];

  const addItem = () => setItems([...items, { name: "", qty: 1 }]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "52px 22px 20px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </button>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 900, margin: 0 }}>Nouvelle commande</h2>
        </div>
        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ height: 4, borderRadius: 2, background: s <= step ? C.primary : C.bgDeep, transition: "background 0.3s" }} />
              <p style={{ color: s <= step ? C.primary : C.muted, fontSize: 10, margin: 0, fontWeight: s === step ? 700 : 400 }}>
                {["Adresse", "Articles", "Résumé"][s - 1]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
        {step === 1 && (
          <div>
            <p style={{ color: C.sub, fontSize: 13, fontWeight: 600, margin: "0 0 16px" }}>Type de livraison</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { id: "standard", label: "Standard", desc: "2–4h", emoji: "📦", price: "2 000 MGA" },
                { id: "express", label: "Express", desc: "30–60 min", emoji: "⚡", price: "4 500 MGA" },
              ].map(t => (
                <div key={t.id} onClick={() => setType(t.id)} style={{
                  background: type === t.id ? C.primaryLt : C.card,
                  border: `2px solid ${type === t.id ? C.primary : C.border}`,
                  borderRadius: 16, padding: 16, cursor: "pointer", textAlign: "center",
                }}>
                  <p style={{ fontSize: 28, margin: "0 0 8px" }}>{t.emoji}</p>
                  <p style={{ color: C.text, fontWeight: 800, fontSize: 15, margin: "0 0 3px" }}>{t.label}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: "0 0 6px" }}>{t.desc}</p>
                  <p style={{ color: type === t.id ? C.primary : C.muted, fontWeight: 700, fontSize: 12, margin: 0 }}>{t.price}</p>
                </div>
              ))}
            </div>

            <p style={{ color: C.sub, fontSize: 13, fontWeight: 600, margin: "0 0 10px" }}>Adresse de livraison</p>
            <div style={{ background: C.card, border: `1.5px solid ${address ? C.primary : C.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Icon name="location" size={18} color={address ? C.primary : C.muted} />
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Entrez l'adresse de livraison..."
                style={{ flex: 1, border: "none", background: "none", outline: "none", color: C.text, fontSize: 14, fontFamily: "inherit" }}
              />
            </div>
            <p style={{ color: C.muted, fontSize: 11, margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Adresses récentes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestions.map(s => (
                <div key={s} onClick={() => setAddress(s)} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                }}>
                  <Icon name="location" size={14} color={C.muted} />
                  <p style={{ color: C.sub, fontSize: 13, margin: 0 }}>{s}</p>
                </div>
              ))}
            </div>

            <p style={{ color: C.sub, fontSize: 13, fontWeight: 600, margin: "20px 0 10px" }}>Note pour le livreur (optionnel)</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ex: Sonner deux fois, 2e étage..."
              style={{
                width: "100%", background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "12px 14px", color: C.text, fontSize: 13,
                fontFamily: "inherit", resize: "none", outline: "none", minHeight: 80,
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ color: C.sub, fontSize: 13, fontWeight: 600, margin: "0 0 16px" }}>Articles à livrer</p>
            {items.map((item, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="package" size={18} color={C.primary} />
                  </div>
                  <p style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: 0 }}>Article {i + 1}</p>
                </div>
                <input
                  value={item.name}
                  onChange={e => { const n = [...items]; n[i].name = e.target.value; setItems(n); }}
                  placeholder="Description de l'article"
                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 8 }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Quantité :</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.bg, borderRadius: 10, padding: "4px 10px", border: `1px solid ${C.border}` }}>
                    <button onClick={() => { const n = [...items]; n[i].qty = Math.max(1, n[i].qty - 1); setItems(n); }}
                      style={{ background: "none", border: "none", color: C.primary, fontWeight: 900, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>−</button>
                    <p style={{ color: C.text, fontWeight: 700, fontSize: 14, margin: 0, minWidth: 20, textAlign: "center" }}>{item.qty}</p>
                    <button onClick={() => { const n = [...items]; n[i].qty += 1; setItems(n); }}
                      style={{ background: "none", border: "none", color: C.primary, fontWeight: 900, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>+</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem} style={{
              width: "100%", background: C.bg, border: `1.5px dashed ${C.border}`,
              borderRadius: 14, padding: "14px", color: C.primary, fontWeight: 700,
              fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Icon name="plus" size={16} color={C.primary} />
              Ajouter un article
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ color: C.sub, fontSize: 13, fontWeight: 600, margin: "0 0 16px" }}>Résumé de la commande</p>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Type</p>
                <span style={{ background: type === "express" ? C.accentLt : C.primaryLt, color: type === "express" ? C.accent : C.primary, padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  {type === "express" ? "⚡ Express" : "📦 Standard"}
                </span>
              </div>
              <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
              <div style={{ marginBottom: 10 }}>
                <p style={{ color: C.muted, fontSize: 12, margin: "0 0 6px" }}>Adresse</p>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{address || "Non renseignée"}</p>
              </div>
              {note && (
                <>
                  <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
                  <div>
                    <p style={{ color: C.muted, fontSize: 12, margin: "0 0 4px" }}>Note</p>
                    <p style={{ color: C.text, fontSize: 13, margin: 0 }}>{note}</p>
                  </div>
                </>
              )}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <p style={{ color: C.muted, fontSize: 12, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Articles</p>
              {items.filter(i => i.name).map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ color: C.text, fontSize: 13, margin: 0 }}>{item.name}</p>
                  <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>×{item.qty}</p>
                </div>
              ))}
              <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Frais de livraison</p>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{type === "express" ? "4 500" : "2 000"} MGA</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 800, margin: 0 }}>Total estimé</p>
                <p style={{ color: C.primary, fontSize: 15, fontWeight: 900, margin: 0 }}>{type === "express" ? "~46 500" : "~44 000"} MGA</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div style={{ padding: "12px 22px 28px", background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} style={{
            flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: "14px", color: C.text, fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}>Retour</button>
        )}
        <button onClick={() => { if (step < 3) setStep(step + 1); else onNavigate(SCREENS.CONFIRM); }} style={{
          flex: 2, background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`,
          border: "none", borderRadius: 14, padding: "14px",
          color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: `0 6px 20px ${C.primary}40`,
        }}>
          {step === 3 ? <><Icon name="check" size={18} color="#fff" /> Confirmer la commande</> : <>Continuer <Icon name="arrow" size={18} color="#fff" /></>}
        </button>
      </div>
    </div>
  );
};

// ─── Tracking Screen ──────────────────────────────────────────────────────────
const TrackingScreen = ({ order, onNavigate }) => {
  const [pulse, setPulse] = useState(0);
  useEffect(() => { const t = setInterval(() => setPulse(p => (p + 1) % 60), 60); return () => clearInterval(t); }, []);

  if (!order) return null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Map */}
      <div style={{ flex: 1, position: "relative", background: "#E8F0E8", overflow: "hidden" }}>
        {/* Map bg */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect width="100%" height="100%" fill="#EEF4EE" />
          {/* Roads */}
          {[["0%","55%","100%","55%",14], ["40%","0%","40%","100%",12], ["0%","30%","70%","60%",10], ["60%","0%","80%","100%",8]].map(([x1,y1,x2,y2,w],i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4E4D4" strokeWidth={w} />
          ))}
          {/* Route highlight */}
          <line x1="35%" y1="65%" x2="65%" y2="35%" stroke={C.primary} strokeWidth="3" strokeDasharray="10 5" />
          {/* Blocks */}
          {[[10,20],[20,65],[55,65],[75,30],[80,70],[15,40],[60,15]].map(([x,y],i) => (
            <rect key={i} x={`${x}%`} y={`${y}%`} width="8%" height="6%" rx="4" fill="#D8EAD8" stroke="#C8DCC8" strokeWidth="1" />
          ))}
          {/* Trees */}
          {[[50,50],[30,30],[70,70]].map(([x,y],i) => (
            <circle key={i} cx={`${x}%`} cy={`${y}%`} r="8" fill="#B8D4B8" opacity="0.6" />
          ))}

          {/* Driver */}
          <circle cx="35%" cy="65%" r={16 + (pulse % 20)} fill={C.accent} fillOpacity="0.1" />
          <circle cx="35%" cy="65%" r="12" fill={C.accent} fillOpacity="0.2" />
          <circle cx="35%" cy="65%" r="8" fill={C.accent} />
          <circle cx="35%" cy="65%" r="3" fill="#fff" />

          {/* Destination */}
          <circle cx="65%" cy="35%" r="14" fill={C.primary} fillOpacity="0.15" />
          <circle cx="65%" cy="35%" r="9" fill={C.primary} />
          <circle cx="65%" cy="35%" r="4" fill="#fff" />
        </svg>

        {/* Header overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "52px 20px 16px", background: "linear-gradient(180deg, rgba(238,244,238,0.95) 60%, transparent 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: C.white + "CC", border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}>
              <Icon name="arrowLeft" size={18} color={C.text} />
            </button>
            <div style={{ flex: 1, background: C.white + "CC", border: `1px solid ${C.border}`, borderRadius: 12, padding: "8px 14px", backdropFilter: "blur(8px)" }}>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Suivi de</p>
              <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{order.id}</p>
            </div>
            <StatusBadge status={order.status} small />
          </div>
        </div>

        {/* ETA chip */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "8px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <p style={{ color: C.text, fontWeight: 800, fontSize: 14, margin: 0 }}>Arrivée dans {order.eta}</p>
        </div>
      </div>

      {/* Bottom Panel */}
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", padding: "20px 22px 32px", boxShadow: "0 -4px 24px rgba(0,0,0,0.08)" }}>
        {/* Driver */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 20, flexShrink: 0 }}>
            {order.driver.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.text, fontWeight: 800, fontSize: 16, margin: 0 }}>{order.driver.name}</p>
            <p style={{ color: C.muted, fontSize: 12, margin: "2px 0 0" }}>{order.driver.vehicle}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Icon name="star" size={12} color={C.yellow} style={{ fill: C.yellow }} />
              <p style={{ color: C.yellow, fontWeight: 700, fontSize: 12, margin: 0 }}>{order.driver.rating}</p>
              <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>· Votre livreur</p>
            </div>
          </div>
          <a href={`tel:${order.driver.phone}`} style={{
            width: 44, height: 44, borderRadius: 12,
            background: C.primaryLt, border: `1px solid ${C.primary}30`,
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
          }}>
            <Icon name="phone" size={20} color={C.primary} />
          </a>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: 16 }}>
          {order.timeline.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < order.timeline.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: step.done ? C.primary : C.bgDeep, border: `2px solid ${step.done ? C.primary : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {step.done && <Icon name="check" size={12} color="#fff" />}
                </div>
                {i < order.timeline.length - 1 && <div style={{ width: 2, height: 16, background: step.done ? C.primary : C.border, marginTop: 2 }} />}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: step.done ? C.text : C.muted, fontWeight: step.done ? 700 : 400, fontSize: 13, margin: 0 }}>{step.label}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{step.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => onNavigate(SCREENS.ORDER_DETAIL)} style={{
          width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: "12px", color: C.primary, fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          Voir les détails de la commande
        </button>
      </div>
    </div>
  );
};

// ─── Order Detail Screen ──────────────────────────────────────────────────────
const OrderDetailScreen = ({ order, onNavigate }) => {
  if (!order) return null;
  const isDelivered = order.status === "Livré";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 22px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Commande</p>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 900, margin: 0 }}>{order.id}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
        {/* Items */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <p style={{ color: C.muted, fontSize: 11, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Articles commandés</p>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < order.items.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="package" size={16} color={C.primary} />
                </div>
                <div>
                  <p style={{ color: C.text, fontWeight: 600, fontSize: 13, margin: 0 }}>{item.name}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: "1px 0 0" }}>Quantité : {item.qty}</p>
                </div>
              </div>
              <p style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: 0 }}>{(item.price * item.qty).toLocaleString()} MGA</p>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Frais de livraison</p>
            <p style={{ color: C.text, fontSize: 13, margin: 0 }}>{order.deliveryFee.toLocaleString()} MGA</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <p style={{ color: C.text, fontWeight: 800, fontSize: 15, margin: 0 }}>Total</p>
            <p style={{ color: C.primary, fontWeight: 900, fontSize: 16, margin: 0 }}>{(order.total + order.deliveryFee).toLocaleString()} MGA</p>
          </div>
        </div>

        {/* Address */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <p style={{ color: C.muted, fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Livraison à</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="location" size={16} color={C.accent} />
            </div>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{order.address}</p>
          </div>
        </div>

        {/* Driver */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <p style={{ color: C.muted, fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Livreur</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 17, flexShrink: 0 }}>
              {order.driver.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: C.text, fontWeight: 700, fontSize: 14, margin: 0 }}>{order.driver.name}</p>
              <p style={{ color: C.muted, fontSize: 12, margin: "2px 0" }}>{order.driver.vehicle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={11} color={s <= Math.floor(order.driver.rating) ? C.yellow : C.border} />)}
                <p style={{ color: C.muted, fontSize: 11, margin: "0 0 0 2px" }}>{order.driver.rating}</p>
              </div>
            </div>
            <a href={`tel:${order.driver.phone}`} style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryLt, border: `1px solid ${C.primary}20`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <Icon name="phone" size={18} color={C.primary} />
            </a>
          </div>
        </div>

        {/* Info Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Date", value: order.date },
            { label: "Type", value: order.type === "Express" ? "⚡ Express" : "📦 Standard" },
          ].map(info => (
            <div key={info.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
              <p style={{ color: C.muted, fontSize: 11, margin: "0 0 4px" }}>{info.label}</p>
              <p style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: 0 }}>{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div style={{ padding: "12px 22px 28px", background: C.card, borderTop: `1px solid ${C.border}` }}>
        {isDelivered ? (
          <button onClick={() => onNavigate(SCREENS.RATE)} style={{
            width: "100%", background: `linear-gradient(135deg, ${C.yellow}, #D97706)`,
            border: "none", borderRadius: 14, padding: "15px",
            color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Icon name="star" size={18} color="#fff" />
            Évaluer la livraison
          </button>
        ) : (
          <button onClick={() => onNavigate(SCREENS.TRACKING)} style={{
            width: "100%", background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`,
            border: "none", borderRadius: 14, padding: "15px",
            color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 6px 20px ${C.primary}40`,
          }}>
            <Icon name="map" size={18} color="#fff" />
            Suivre la livraison
          </button>
        )}
      </div>
    </div>
  );
};

// ─── History Screen ───────────────────────────────────────────────────────────
const HistoryScreen = ({ onNavigate, onSelectOrder }) => {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "En cours", "Livré", "Annulé"];
  const filtered = filter === "Tous" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 22px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </button>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 900, margin: 0 }}>Mes commandes</h2>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? C.primary : C.bg,
              border: `1px solid ${filter === f ? C.primary : C.border}`,
              borderRadius: 20, padding: "6px 16px",
              color: filter === f ? "#fff" : C.muted,
              fontWeight: filter === f ? 700 : 400, fontSize: 12,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
        {filtered.map(order => (
          <div key={order.id} onClick={() => { onSelectOrder(order); onNavigate(SCREENS.ORDER_DETAIL); }}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 10, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{order.id} · {order.date}</p>
                <p style={{ color: C.text, fontSize: 15, fontWeight: 800, margin: "3px 0 0" }}>{order.items.map(i => i.name).join(", ")}</p>
              </div>
              <StatusBadge status={order.status} small />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Icon name="location" size={13} color={C.muted} />
              <p style={{ color: C.muted, fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.address}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: C.primary, fontWeight: 800, fontSize: 14, margin: 0 }}>{(order.total + order.deliveryFee).toLocaleString()} MGA</p>
              <div style={{ display: "flex", gap: 6 }}>
                {order.status === "Livré" && (
                  <button onClick={e => { e.stopPropagation(); onSelectOrder(order); onNavigate(SCREENS.RATE); }}
                    style={{ background: C.accentLt, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "5px 10px", color: C.accent, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
                    ⭐ Évaluer
                  </button>
                )}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="arrow" size={14} color={C.muted} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Profile Screen ───────────────────────────────────────────────────────────
const ProfileScreen = ({ onNavigate }) => {
  const menuSections = [
    {
      title: "Mon compte", items: [
        { icon: "edit", label: "Modifier le profil" },
        { icon: "location", label: "Mes adresses" },
        { icon: "wallet", label: "Paiements & Portefeuille" },
      ]
    },
    {
      title: "Support", items: [
        { icon: "bell", label: "Notifications", screen: SCREENS.NOTIFICATIONS },
        { icon: "shield", label: "Sécurité & Confidentialité" },
        { icon: "help", label: "Aide & Support" },
        { icon: "settings", label: "Paramètres" },
      ]
    }
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(150deg, ${C.primary} 0%, #0F4A32 100%)`, padding: "52px 22px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color="#fff" />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 28 }}>L</div>
          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Lalaina Rabe</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 8px" }}>lalaina.rabe@email.mg</p>
            <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "3px 10px", color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 600 }}>Client Premium</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 22px", transform: "translateY(-20px)" }}>
        <div style={{ background: C.card, borderRadius: 20, padding: 16, border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
          {[
            { value: "8", label: "Commandes" },
            { value: "6", label: "Livrées" },
            { value: "4.9★", label: "Note moy." },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: "center", padding: "4px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
              <p style={{ color: C.primary, fontWeight: 900, fontSize: 20, margin: 0 }}>{s.value}</p>
              <p style={{ color: C.muted, fontSize: 10, margin: "2px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "0 22px" }}>
        {menuSections.map(section => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px 4px" }}>{section.title}</p>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              {section.items.map((item, i) => (
                <div key={item.label}>
                  <div onClick={() => item.screen && onNavigate(item.screen)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={item.icon} size={17} color={C.primary} />
                    </div>
                    <p style={{ color: C.text, fontWeight: 600, fontSize: 14, flex: 1, margin: 0 }}>{item.label}</p>
                    <Icon name="arrow" size={15} color={C.muted} />
                  </div>
                  {i < section.items.length - 1 && <div style={{ height: 1, background: C.border, marginLeft: 66 }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button style={{ width: "100%", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "14px", color: C.red, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

// ─── Notifications Screen ─────────────────────────────────────────────────────
const NotificationsScreen = ({ onNavigate }) => {
  const notifs = [
    { id: 1, emoji: "🚚", title: "Votre livreur est en route", desc: "CMD-5512 · Toky Randria démarre la livraison", time: "Il y a 2 min", unread: true },
    { id: 2, emoji: "✅", title: "Commande confirmée", desc: "CMD-5512 a été validée et assignée", time: "Il y a 15 min", unread: true },
    { id: 3, emoji: "📦", title: "Nouvelle commande créée", desc: "CMD-5512 · Express · Analamahitsy", time: "Il y a 20 min", unread: false },
    { id: 4, emoji: "⭐", title: "Merci pour votre évaluation", desc: "Vous avez noté CMD-5498 : 5 étoiles", time: "Hier, 12:30", unread: false },
    { id: 5, emoji: "🎁", title: "Offre spéciale disponible", desc: "Livraison gratuite ce weekend sur toutes vos commandes", time: "Hier, 09:00", unread: false },
    { id: 6, emoji: "✅", title: "Livraison confirmée", desc: "CMD-5498 a bien été livrée", time: "Hier, 11:50", unread: false },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 22px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </button>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 900, margin: 0, flex: 1 }}>Notifications</h2>
          <span style={{ background: C.primaryLt, border: `1px solid ${C.primary}30`, borderRadius: 10, padding: "3px 10px", color: C.primary, fontSize: 12, fontWeight: 700 }}>2 nouvelles</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 22px" }}>
        {notifs.map(n => (
          <div key={n.id} style={{
            background: n.unread ? C.primaryLt : C.card,
            border: `1px solid ${n.unread ? C.primary + "30" : C.border}`,
            borderRadius: 14, padding: "12px 14px", marginBottom: 8,
            display: "flex", gap: 12, cursor: "pointer",
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: n.unread ? `${C.primary}20` : C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {n.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ color: C.text, fontWeight: n.unread ? 700 : 500, fontSize: 13, margin: 0, flex: 1 }}>{n.title}</p>
                {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0, marginTop: 3, marginLeft: 8 }} />}
              </div>
              <p style={{ color: C.muted, fontSize: 12, margin: "3px 0 4px" }}>{n.desc}</p>
              <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Confirm Screen ───────────────────────────────────────────────────────────
const ConfirmScreen = ({ onNavigate }) => {
  const [animDone, setAnimDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimDone(true), 600); return () => clearTimeout(t); }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 30px", background: C.bg, textAlign: "center" }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, #2D9B6B)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: `0 16px 48px ${C.primary}40`, transform: animDone ? "scale(1)" : "scale(0.5)", transition: "transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
        <Icon name="check" size={52} color="#fff" />
      </div>

      <h2 style={{ color: C.text, fontSize: 26, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.5px" }}>Commande confirmée !</h2>
      <p style={{ color: C.sub, fontSize: 15, margin: "0 0 8px" }}>Votre commande CMD-5513 a été transmise</p>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 36px" }}>Un livreur vous sera assigné très prochainement. Vous recevrez une notification dès que votre colis sera en route.</p>

      <div style={{ width: "100%", background: C.card, borderRadius: 20, padding: 20, border: `1px solid ${C.border}`, marginBottom: 28, textAlign: "left" }}>
        {[
          { label: "Numéro de commande", value: "CMD-5513" },
          { label: "Type", value: "Standard" },
          { label: "Délai estimé", value: "2–4 heures" },
          { label: "Statut", value: "En attente d'assignation" },
        ].map(info => (
          <div key={info.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{info.label}</p>
            <p style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: 0 }}>{info.value}</p>
          </div>
        ))}
      </div>

      <button onClick={() => onNavigate(SCREENS.TRACKING)} style={{
        width: "100%", background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`,
        border: "none", borderRadius: 16, padding: "16px",
        color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", marginBottom: 12,
        boxShadow: `0 8px 24px ${C.primary}40`,
      }}>
        Suivre ma commande
      </button>
      <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", padding: "8px" }}>
        Retour à l'accueil
      </button>
    </div>
  );
};

// ─── Rate Screen ──────────────────────────────────────────────────────────────
const RateScreen = ({ order, onNavigate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const tags = ["Rapide", "Soigneux", "Ponctuel", "Bien emballé", "Sympathique", "Professionnel"];
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = tag => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  if (submitted) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 30px", background: C.bg, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>⭐</div>
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 900, margin: "0 0 10px" }}>Merci !</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 32px" }}>Votre évaluation aide notre communauté de livreurs à s'améliorer.</p>
      <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`, border: "none", borderRadius: 14, padding: "14px 40px", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
        Retour à l'accueil
      </button>
    </div>
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 22px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </button>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 900, margin: 0 }}>Évaluer la livraison</h2>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
        {/* Driver */}
        {order && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 20 }}>
              {order.driver.name[0]}
            </div>
            <div>
              <p style={{ color: C.text, fontWeight: 700, fontSize: 15, margin: 0 }}>{order.driver.name}</p>
              <p style={{ color: C.muted, fontSize: 12, margin: "2px 0 0" }}>{order.id}</p>
            </div>
          </div>
        )}

        {/* Stars */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ color: C.sub, fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Comment s'est passée votre livraison ?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
                style={{ cursor: "pointer", transition: "transform 0.15s", transform: (hover || rating) >= s ? "scale(1.15)" : "scale(1)" }}>
                <svg width={40} height={40} viewBox="0 0 24 24" fill={(hover || rating) >= s ? C.yellow : "none"} stroke={(hover || rating) >= s ? C.yellow : C.border} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ color: C.primary, fontWeight: 700, fontSize: 14, marginTop: 10 }}>
              {["", "Très déçu 😔", "Décevant 😕", "Correct 😐", "Bien 😊", "Excellent ! 🌟"][rating]}
            </p>
          )}
        </div>

        {/* Tags */}
        <p style={{ color: C.sub, fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>Ce qui s'est démarqué</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {tags.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} style={{
              background: selectedTags.includes(tag) ? C.primaryLt : C.card,
              border: `1.5px solid ${selectedTags.includes(tag) ? C.primary : C.border}`,
              borderRadius: 20, padding: "7px 16px",
              color: selectedTags.includes(tag) ? C.primary : C.muted,
              fontWeight: selectedTags.includes(tag) ? 700 : 400, fontSize: 13,
              cursor: "pointer",
            }}>{tag}</button>
          ))}
        </div>

        {/* Comment */}
        <p style={{ color: C.sub, fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>Ajouter un commentaire</p>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Partagez votre expérience..."
          style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", color: C.text, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", minHeight: 100, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ padding: "12px 22px 28px", background: C.card, borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => setSubmitted(true)} disabled={rating === 0} style={{
          width: "100%",
          background: rating > 0 ? `linear-gradient(135deg, ${C.yellow}, #D97706)` : C.bg,
          border: `1px solid ${rating > 0 ? C.yellow : C.border}`,
          borderRadius: 16, padding: "16px",
          color: rating > 0 ? "#fff" : C.muted, fontWeight: 800, fontSize: 16,
          cursor: rating > 0 ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: rating > 0 ? `0 8px 24px ${C.yellow}40` : "none",
          transition: "all 0.2s",
        }}>
          <Icon name="star" size={18} color={rating > 0 ? "#fff" : C.muted} />
          Envoyer l'évaluation
        </button>
      </div>
    </div>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const BottomNav = ({ current, onNavigate }) => {
  const tabs = [
    { id: SCREENS.HOME, icon: "home", label: "Accueil" },
    { id: SCREENS.NEW_ORDER, icon: "plus", label: "Commander" },
    { id: SCREENS.HISTORY, icon: "history", label: "Commandes" },
    { id: SCREENS.PROFILE, icon: "user", label: "Profil" },
  ];
  const visible = [SCREENS.HOME, SCREENS.NEW_ORDER, SCREENS.HISTORY, SCREENS.PROFILE, SCREENS.NOTIFICATIONS];
  if (!visible.includes(current)) return null;

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", paddingBottom: 8, zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
      {tabs.map(tab => {
        const active = current === tab.id || (current === SCREENS.NOTIFICATIONS && tab.id === SCREENS.HOME);
        const isCenter = tab.id === SCREENS.NEW_ORDER;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)} style={{
            flex: 1, background: "none", border: "none", padding: isCenter ? "0 4px 4px" : "10px 4px 4px",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative",
          }}>
            {isCenter ? (
              <div style={{ width: 50, height: 50, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, #0F4A32)`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -24, boxShadow: `0 8px 20px ${C.primary}50`, border: "3px solid #fff" }}>
                <Icon name="plus" size={24} color="#fff" />
              </div>
            ) : (
              <Icon name={tab.icon} size={22} color={active ? C.primary : C.muted} />
            )}
            <p style={{ color: isCenter ? C.primary : active ? C.primary : C.muted, fontSize: 10, margin: 0, fontWeight: active || isCenter ? 700 : 400 }}>{tab.label}</p>
          </button>
        );
      })}
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedOrder, setSelectedOrder] = useState(ORDERS[0]);

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.HOME:          return <HomeScreen onNavigate={setScreen} onSelectOrder={setSelectedOrder} />;
      case SCREENS.NEW_ORDER:     return <NewOrderScreen onNavigate={setScreen} />;
      case SCREENS.TRACKING:      return <TrackingScreen order={selectedOrder} onNavigate={setScreen} />;
      case SCREENS.ORDER_DETAIL:  return <OrderDetailScreen order={selectedOrder} onNavigate={setScreen} />;
      case SCREENS.HISTORY:       return <HistoryScreen onNavigate={setScreen} onSelectOrder={setSelectedOrder} />;
      case SCREENS.PROFILE:       return <ProfileScreen onNavigate={setScreen} />;
      case SCREENS.NOTIFICATIONS: return <NotificationsScreen onNavigate={setScreen} />;
      case SCREENS.CONFIRM:       return <ConfirmScreen onNavigate={setScreen} />;
      case SCREENS.RATE:          return <RateScreen order={selectedOrder} onNavigate={setScreen} />;
      default:                    return <HomeScreen onNavigate={setScreen} onSelectOrder={setSelectedOrder} />;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#D4CEC6", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button, a, input, textarea { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: #A8A29E; }
      `}</style>

      <div style={{ width: 390, height: 844, background: C.bg, borderRadius: 50, overflow: "hidden", position: "relative", boxShadow: "0 40px 120px rgba(0,0,0,0.35), 0 0 0 8px #B8B0A4, 0 0 0 10px #A8A09A", border: "1px solid #C0B8B0" }}>
        {/* Status Bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", pointerEvents: "none" }}>
          <p style={{ color: C.text, fontSize: 13, fontWeight: 800, margin: 0 }}>9:41</p>
          <div style={{ width: 120, height: 32, background: "#000", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0 }} />
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 1 }}>
              {[1,2,3,4].map(b => <div key={b} style={{ width: 3, height: 6 + b * 2, background: C.text, borderRadius: 1, opacity: b <= 3 ? 1 : 0.3 }} />)}
            </div>
            <p style={{ color: C.text, fontSize: 11, margin: "0 0 0 2px" }}>100%</p>
          </div>
        </div>

        {/* Screen */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {renderScreen()}
        </div>

        <BottomNav current={screen} onNavigate={setScreen} />
      </div>

      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}>
        <p style={{ color: "rgba(0,0,0,0.3)", fontSize: 12, margin: 0, textAlign: "center" }}>
          Système de Livraison Intelligente · Interface Client
        </p>
      </div>
    </div>
  );
}
