import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0F1C",
  card: "#111827",
  cardLight: "#1A2235",
  accent: "#F97316",
  accentDim: "#7C3A1A",
  teal: "#14B8A6",
  green: "#22C55E",
  red: "#EF4444",
  yellow: "#EAB308",
  text: "#F1F5F9",
  muted: "#64748B",
  border: "#1E293B",
};

const statusColors = {
  "En attente": { bg: "#1C1A0A", text: "#EAB308", dot: "#EAB308" },
  "En cours": { bg: "#0A1A2C", text: "#38BDF8", dot: "#38BDF8" },
  Livré: { bg: "#0A1C0D", text: "#22C55E", dot: "#22C55E" },
  Annulé: { bg: "#1C0A0A", text: "#EF4444", dot: "#EF4444" },
};

const deliveries = [
  {
    id: "LIV-2847",
    client: "Aina Rakoto",
    phone: "+261 34 12 345 67",
    address: "Lot IVN 45, Analamahitsy, Antananarivo",
    distance: "3.2 km",
    eta: "12 min",
    type: "Express",
    status: "En cours",
    items: 2,
    weight: "1.4 kg",
    note: "Sonner deux fois",
    coords: { lat: -18.8792, lng: 47.5079 },
    time: "14:30",
  },
  {
    id: "LIV-2848",
    client: "Fanja Rasolofo",
    phone: "+261 33 98 765 43",
    address: "Rue Pasteur, Isoraka, Antananarivo",
    distance: "5.8 km",
    eta: "22 min",
    type: "Standard",
    status: "En attente",
    items: 4,
    weight: "3.1 kg",
    note: "",
    coords: { lat: -18.9105, lng: 47.5389 },
    time: "15:00",
  },
  {
    id: "LIV-2849",
    client: "Mamy Andriamaro",
    phone: "+261 32 56 789 01",
    address: "Ankadimbahoaka, Antananarivo",
    distance: "7.4 km",
    eta: "31 min",
    type: "Standard",
    status: "En attente",
    items: 1,
    weight: "0.8 kg",
    note: "Appeler à l'arrivée",
    coords: { lat: -18.9501, lng: 47.5205 },
    time: "15:45",
  },
  {
    id: "LIV-2843",
    client: "Hery Raharison",
    phone: "+261 34 45 678 90",
    address: "Tsaralalana, Antananarivo",
    distance: "2.1 km",
    eta: "—",
    type: "Express",
    status: "Livré",
    items: 3,
    weight: "2.2 kg",
    note: "",
    coords: { lat: -18.9107, lng: 47.5373 },
    time: "13:15",
  },
];

const SCREENS = {
  HOME: "home",
  DELIVERY_DETAIL: "delivery_detail",
  MAP: "map",
  HISTORY: "history",
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
  SCANNER: "scanner",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor", style = {} }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    map: (
      <>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </>
    ),
    package: (
      <>
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    history: (
      <>
        <polyline points="12 8 12 12 14 14" />
        <path d="M3.05 11a9 9 0 1 0 .5-4.5" />
        <polyline points="3 3 3 7 7 7" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    phone: (
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.93 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    ),
    navigation: (
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    ),
    scan: (
      <>
        <polyline points="23 7 23 1 17 1" />
        <line x1="17" y1="7" x2="23" y2="1" />
        <polyline points="1 17 1 23 7 23" />
        <line x1="7" y1="17" x2="1" y2="23" />
        <polyline points="1 7 1 1 7 1" />
        <line x1="7" y1="1" x2="1" y2="7" />
        <polyline points="23 17 23 23 17 23" />
        <line x1="17" y1="23" x2="23" y2="17" />
      </>
    ),
    arrow: <polyline points="9 18 15 12 9 6" />,
    arrowLeft: <polyline points="15 18 9 12 15 6" />,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    truck: (
      <>
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    lightning: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </>
    ),
    location: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    wallet: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <circle cx="17" cy="15" r="1" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {icons[name]}
    </svg>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, small = false }) => {
  const s = statusColors[status] || statusColors["En attente"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.dot}30`,
        borderRadius: 20,
        padding: small ? "2px 8px" : "4px 12px",
        fontSize: small ? 10 : 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: small ? 5 : 6,
          height: small ? 5 : 6,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
          boxShadow: `0 0 6px ${s.dot}`,
        }}
      />
      {status}
    </span>
  );
};

// ─── Home Screen ──────────────────────────────────────────────────────────────
const HomeScreen = ({ onNavigate, onSelectDelivery }) => {
  const [isOnline, setIsOnline] = useState(true);
  const active = deliveries.filter((d) => d.status === "En cours");
  const pending = deliveries.filter((d) => d.status === "En attente");
  const done = deliveries.filter((d) => d.status === "Livré");

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          padding: "52px 20px 20px",
          background: `linear-gradient(180deg, #0D1525 0%, ${COLORS.bg} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `${COLORS.accent}08`,
            border: `1px solid ${COLORS.accent}15`,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: COLORS.muted, fontSize: 12, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Bonjour 👋</p>
            <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: "4px 0 0", letterSpacing: "-0.5px" }}>Toky Randria</h2>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => onNavigate(SCREENS.NOTIFICATIONS)}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Icon name="bell" size={18} color={COLORS.text} />
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  background: COLORS.accent,
                  borderRadius: "50%",
                  border: `2px solid ${COLORS.card}`,
                }}
              />
            </button>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${COLORS.accent}, #B45309)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#fff",
                fontSize: 15,
                cursor: "pointer",
              }}
              onClick={() => onNavigate(SCREENS.PROFILE)}
            >
              T
            </div>
          </div>
        </div>

        {/* Online Toggle */}
        <div
          style={{
            marginTop: 20,
            background: COLORS.card,
            border: `1px solid ${isOnline ? COLORS.green + "40" : COLORS.border}`,
            borderRadius: 16,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: isOnline ? COLORS.green : COLORS.muted,
                boxShadow: isOnline ? `0 0 10px ${COLORS.green}` : "none",
              }}
            />
            <div>
              <p style={{ margin: 0, color: COLORS.text, fontWeight: 700, fontSize: 14 }}>
                {isOnline ? "En ligne" : "Hors ligne"}
              </p>
              <p style={{ margin: 0, color: COLORS.muted, fontSize: 11 }}>
                {isOnline ? "Disponible pour les livraisons" : "Vous ne recevrez pas de commandes"}
              </p>
            </div>
          </div>
          <div
            onClick={() => setIsOnline(!isOnline)}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: isOnline ? COLORS.green : COLORS.border,
              cursor: "pointer",
              position: "relative",
              transition: "background 0.3s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: isOnline ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.3s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Aujourd'hui", value: done.length + active.length, unit: "livraisons", icon: "truck", color: COLORS.teal },
            { label: "Revenus", value: "48 500", unit: "MGA", icon: "wallet", color: COLORS.accent },
            { label: "Note", value: "4.8", unit: "/ 5", icon: "star", color: COLORS.yellow },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "14px 12px",
                textAlign: "center",
              }}
            >
              <Icon name={stat.icon} size={20} color={stat.color} />
              <p style={{ margin: "8px 0 2px", color: COLORS.text, fontWeight: 800, fontSize: 18 }}>{stat.value}</p>
              <p style={{ margin: 0, color: COLORS.muted, fontSize: 10 }}>{stat.unit}</p>
              <p style={{ margin: "2px 0 0", color: COLORS.muted, fontSize: 9, letterSpacing: "0.05em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Delivery */}
      {active.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, margin: 0 }}>
              🚀 Livraison en cours
            </h3>
          </div>
          {active.map((d) => (
            <div
              key={d.id}
              onClick={() => { onSelectDelivery(d); onNavigate(SCREENS.DELIVERY_DETAIL); }}
              style={{
                background: `linear-gradient(135deg, ${COLORS.card}, #0D1525)`,
                border: `1px solid #38BDF840`,
                borderRadius: 20,
                padding: 16,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>{d.id}</p>
                  <p style={{ color: COLORS.text, fontSize: 16, fontWeight: 700, margin: "2px 0" }}>{d.client}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div
                style={{
                  background: COLORS.cardLight,
                  borderRadius: 12,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Icon name="location" size={16} color={COLORS.accent} />
                <p style={{ color: COLORS.text, fontSize: 13, margin: 0, flex: 1 }}>{d.address}</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: COLORS.cardLight, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                  <p style={{ color: COLORS.accent, fontWeight: 800, fontSize: 16, margin: 0 }}>{d.eta}</p>
                  <p style={{ color: COLORS.muted, fontSize: 10, margin: 0 }}>ETA</p>
                </div>
                <div style={{ flex: 1, background: COLORS.cardLight, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                  <p style={{ color: COLORS.text, fontWeight: 800, fontSize: 16, margin: 0 }}>{d.distance}</p>
                  <p style={{ color: COLORS.muted, fontSize: 10, margin: 0 }}>Distance</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate(SCREENS.MAP); }}
                  style={{
                    flex: 1,
                    background: COLORS.accent,
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Icon name="navigation" size={14} color="#fff" />
                  Naviguer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Deliveries */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, margin: 0 }}>
            📦 En attente ({pending.length})
          </h3>
          <button
            style={{
              background: "none",
              border: "none",
              color: COLORS.accent,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => onNavigate(SCREENS.HISTORY)}
          >
            Voir tout
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pending.map((d) => (
            <div
              key={d.id}
              onClick={() => { onSelectDelivery(d); onNavigate(SCREENS.DELIVERY_DETAIL); }}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: COLORS.cardLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="package" size={20} color={COLORS.muted} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: COLORS.text, fontWeight: 700, fontSize: 14, margin: 0 }}>{d.client}</p>
                  <StatusBadge status={d.status} small />
                </div>
                <p style={{ color: COLORS.muted, fontSize: 11, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.address}
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ color: COLORS.muted, fontSize: 11 }}>📍 {d.distance}</span>
                  <span style={{ color: COLORS.muted, fontSize: 11 }}>⏱ {d.eta}</span>
                  {d.type === "Express" && (
                    <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 600 }}>⚡ Express</span>
                  )}
                </div>
              </div>
              <Icon name="arrow" size={16} color={COLORS.muted} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Delivery Detail Screen ───────────────────────────────────────────────────
const DeliveryDetailScreen = ({ delivery, onNavigate }) => {
  const [status, setStatus] = useState(delivery?.status || "En attente");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!delivery) return null;

  const nextStatusMap = {
    "En attente": "En cours",
    "En cours": "Livré",
  };
  const nextStatus = nextStatusMap[status];

  const handleAction = () => {
    if (status === "Livré") return;
    if (status === "En cours") {
      setShowConfirm(true);
    } else {
      setStatus(nextStatus);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 16px", background: COLORS.card, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button
            onClick={() => onNavigate(SCREENS.HOME)}
            style={{
              background: COLORS.cardLight,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>Livraison</p>
            <h2 style={{ color: COLORS.text, fontSize: 18, fontWeight: 800, margin: 0 }}>{delivery.id}</h2>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {["En attente", "En cours", "Livré"].map((s, i) => {
            const stages = ["En attente", "En cours", "Livré"];
            const currentIdx = stages.indexOf(status);
            const isActive = i <= currentIdx;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: isActive ? COLORS.accent : COLORS.border,
                    transition: "background 0.3s",
                  }}
                />
                {i < 2 && <div style={{ width: 4 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["En attente", "En cours", "Livré"].map((s) => (
            <p key={s} style={{ color: status === s ? COLORS.accent : COLORS.muted, fontSize: 9, margin: 0, fontWeight: status === s ? 700 : 400 }}>
              {s}
            </p>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {/* Client Info */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <p style={{ color: COLORS.muted, fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Client</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${COLORS.teal}40, ${COLORS.teal}20)`,
                border: `1px solid ${COLORS.teal}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: COLORS.teal,
                fontSize: 18,
              }}
            >
              {delivery.client[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: COLORS.text, fontWeight: 700, fontSize: 16, margin: 0 }}>{delivery.client}</p>
              <p style={{ color: COLORS.muted, fontSize: 12, margin: "2px 0 0" }}>{delivery.phone}</p>
            </div>
            <a
              href={`tel:${delivery.phone}`}
              style={{
                background: COLORS.green + "20",
                border: `1px solid ${COLORS.green}40`,
                borderRadius: 10,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <Icon name="phone" size={18} color={COLORS.green} />
            </a>
          </div>
        </div>

        {/* Address */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <p style={{ color: COLORS.muted, fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Adresse de livraison</p>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: COLORS.accent + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="location" size={18} color={COLORS.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{delivery.address}</p>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>📍 {delivery.distance}</span>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>⏱ ETA: {delivery.eta}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate(SCREENS.MAP)}
            style={{
              marginTop: 12,
              width: "100%",
              background: COLORS.cardLight,
              border: `1px solid ${COLORS.accent}30`,
              borderRadius: 10,
              padding: "10px",
              color: COLORS.accent,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Icon name="navigation" size={15} color={COLORS.accent} />
            Ouvrir la navigation
          </button>
        </div>

        {/* Package Info */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <p style={{ color: COLORS.muted, fontSize: 11, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Colis</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Articles", value: delivery.items },
              { label: "Poids", value: delivery.weight },
              { label: "Type", value: delivery.type },
            ].map((info) => (
              <div key={info.label} style={{ background: COLORS.cardLight, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <p style={{ color: COLORS.text, fontWeight: 700, fontSize: 15, margin: 0 }}>{info.value}</p>
                <p style={{ color: COLORS.muted, fontSize: 10, margin: "2px 0 0" }}>{info.label}</p>
              </div>
            ))}
          </div>
          {delivery.note && (
            <div style={{ background: "#1A1500", border: `1px solid ${COLORS.yellow}30`, borderRadius: 10, padding: "10px 12px", marginTop: 10, display: "flex", gap: 8 }}>
              <span style={{ fontSize: 14 }}>📝</span>
              <p style={{ color: COLORS.yellow, fontSize: 12, margin: 0 }}>{delivery.note}</p>
            </div>
          )}
        </div>

        {/* Scanner */}
        <button
          onClick={() => onNavigate(SCREENS.SCANNER)}
          style={{
            width: "100%",
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: "14px",
            color: COLORS.text,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Icon name="scan" size={18} color={COLORS.muted} />
          Scanner le code de confirmation
        </button>
      </div>

      {/* Action Button */}
      <div style={{ padding: "12px 20px 28px", background: COLORS.card, borderTop: `1px solid ${COLORS.border}` }}>
        {status !== "Livré" ? (
          <button
            onClick={handleAction}
            style={{
              width: "100%",
              background: status === "En cours"
                ? `linear-gradient(135deg, ${COLORS.green}, #16A34A)`
                : `linear-gradient(135deg, ${COLORS.accent}, #B45309)`,
              border: "none",
              borderRadius: 16,
              padding: "16px",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {status === "En cours" ? (
              <><Icon name="check" size={20} color="#fff" /> Confirmer la livraison</>
            ) : (
              <><Icon name="truck" size={20} color="#fff" /> Démarrer la livraison</>
            )}
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>✅</div>
            <p style={{ color: COLORS.green, fontWeight: 700, fontSize: 16, margin: 0 }}>Livraison confirmée !</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", zIndex: 100,
        }}>
          <div style={{
            width: "100%",
            background: COLORS.card,
            borderRadius: "24px 24px 0 0",
            padding: "24px 20px 40px",
            border: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📦</div>
              <h3 style={{ color: COLORS.text, fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Confirmer la livraison ?</h3>
              <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>Cette action est irréversible. Le client sera notifié.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, background: COLORS.cardLight, border: `1px solid ${COLORS.border}`, borderRadius: 14,
                  padding: 14, color: COLORS.text, fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => { setStatus("Livré"); setShowConfirm(false); }}
                style={{
                  flex: 1, background: `linear-gradient(135deg, ${COLORS.green}, #16A34A)`, border: "none",
                  borderRadius: 14, padding: 14, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}
              >
                ✓ Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Map Screen ───────────────────────────────────────────────────────────────
const MapScreen = ({ onNavigate }) => {
  const [pulseAnim, setPulseAnim] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulseAnim((p) => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const activeDelivery = deliveries.find((d) => d.status === "En cours");

  const dots = [
    { x: 52, y: 42, color: COLORS.accent, label: "Vous" },
    { x: 72, y: 28, color: COLORS.teal, label: activeDelivery?.client },
    { x: 30, y: 62, color: COLORS.yellow, label: "En attente" },
  ];

  return (
    <div style={{ height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Fake Map Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0D1520",
          overflow: "hidden",
        }}
      >
        {/* Grid lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={i}>
              <line x1={`${i * 5.5}%`} y1="0" x2={`${i * 5.5}%`} y2="100%" stroke={COLORS.teal} strokeWidth="0.5" />
              <line x1="0" y1={`${i * 5.5}%`} x2="100%" y2={`${i * 5.5}%`} stroke={COLORS.teal} strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Roads */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <line x1="30%" y1="0" x2="52%" y2="42%" stroke="#1E3A4A" strokeWidth="12" />
          <line x1="52%" y1="42%" x2="72%" y2="28%" stroke="#1E3A4A" strokeWidth="8" strokeDasharray="12 6" />
          <line x1="52%" y1="42%" x2="30%" y2="62%" stroke="#1E3A4A" strokeWidth="8" />
          <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#162030" strokeWidth="10" />
          <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#162030" strokeWidth="10" />

          {/* Route highlight */}
          <line x1="52%" y1="42%" x2="72%" y2="28%" stroke={COLORS.accent} strokeWidth="3" strokeDasharray="8 4" opacity="0.8" />

          {/* Buildings */}
          {[[10, 20], [15, 35], [75, 60], [80, 40], [40, 70], [85, 75], [20, 75]].map(([x, y], i) => (
            <rect key={i} x={`${x}%`} y={`${y}%`} width="6%" height="5%" rx="3" fill="#162535" stroke="#1E3A4A" strokeWidth="1" />
          ))}

          {/* Dots */}
          {dots.map((dot, i) => (
            <g key={i}>
              <circle cx={`${dot.x}%`} cy={`${dot.y}%`} r="20" fill={dot.color} fillOpacity="0.08" />
              <circle cx={`${dot.x}%`} cy={`${dot.y}%`} r="12" fill={dot.color} fillOpacity="0.15" />
              <circle cx={`${dot.x}%`} cy={`${dot.y}%`} r="7" fill={dot.color} />
              <circle cx={`${dot.x}%`} cy={`${dot.y}%`} r="3" fill="#fff" />
            </g>
          ))}
        </svg>

        {/* Pulse on driver position */}
        <div
          style={{
            position: "absolute",
            left: "52%",
            top: "42%",
            transform: "translate(-50%, -50%)",
            width: 60 + (pulseAnim % 30),
            height: 60 + (pulseAnim % 30),
            borderRadius: "50%",
            border: `2px solid ${COLORS.accent}`,
            opacity: 1 - (pulseAnim % 30) / 30,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "52px 20px 16px",
          background: "linear-gradient(180deg, rgba(10,15,28,0.95) 0%, transparent 100%)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => onNavigate(SCREENS.HOME)}
            style={{
              background: COLORS.card + "CC",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </button>
          <div style={{ flex: 1, background: COLORS.card + "CC", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", backdropFilter: "blur(8px)" }}>
            <p style={{ color: COLORS.muted, fontSize: 10, margin: 0 }}>Destination</p>
            <p style={{ color: COLORS.text, fontSize: 13, fontWeight: 700, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeDelivery?.address || "Aucune livraison active"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      {activeDelivery && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: COLORS.card + "F0",
            backdropFilter: "blur(12px)",
            borderTop: `1px solid ${COLORS.border}`,
            borderRadius: "24px 24px 0 0",
            padding: "16px 20px 32px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>ETA</p>
              <p style={{ color: COLORS.accent, fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>{activeDelivery.eta}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>Distance</p>
              <p style={{ color: COLORS.text, fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>{activeDelivery.distance}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={`tel:${activeDelivery.phone}`}
              style={{
                flex: 1,
                background: COLORS.cardLight,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: "12px",
                color: COLORS.text,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Icon name="phone" size={16} color={COLORS.green} />
              Appeler
            </a>
            <button
              style={{
                flex: 2,
                background: `linear-gradient(135deg, ${COLORS.accent}, #B45309)`,
                border: "none",
                borderRadius: 14,
                padding: "12px",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Icon name="navigation" size={16} color="#fff" />
              Lancer la navigation
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          background: COLORS.card + "CC",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "12px 10px",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 10,
        }}
      >
        {[
          { color: COLORS.accent, label: "Vous" },
          { color: COLORS.teal, label: "Client" },
          { color: COLORS.yellow, label: "File" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            <p style={{ color: COLORS.muted, fontSize: 9, margin: 0 }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── History Screen ───────────────────────────────────────────────────────────
const HistoryScreen = ({ onNavigate, onSelectDelivery }) => {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "Livré", "En cours", "En attente", "Annulé"];

  const filtered = filter === "Tous" ? deliveries : deliveries.filter((d) => d.status === filter);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 20px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </button>
          <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, margin: 0 }}>Historique</h2>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? COLORS.accent : COLORS.card,
                border: `1px solid ${filter === f ? COLORS.accent : COLORS.border}`,
                borderRadius: 20,
                padding: "6px 14px",
                color: filter === f ? "#fff" : COLORS.muted,
                fontWeight: filter === f ? 700 : 400,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((d) => (
            <div
              key={d.id}
              onClick={() => { onSelectDelivery(d); onNavigate(SCREENS.DELIVERY_DETAIL); }}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>{d.id} · {d.time}</p>
                  <p style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, margin: "3px 0 0" }}>{d.client}</p>
                </div>
                <StatusBadge status={d.status} small />
              </div>
              <p style={{ color: COLORS.muted, fontSize: 12, margin: "0 0 8px" }}>{d.address}</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: COLORS.muted, fontSize: 11 }}>📦 {d.items} articles</span>
                <span style={{ color: COLORS.muted, fontSize: 11 }}>⚖️ {d.weight}</span>
                {d.type === "Express" && <span style={{ color: COLORS.accent, fontSize: 11, fontWeight: 600 }}>⚡ Express</span>}
                <div style={{ flex: 1 }} />
                <Icon name="arrow" size={14} color={COLORS.muted} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Profile Screen ───────────────────────────────────────────────────────────
const ProfileScreen = ({ onNavigate }) => {
  const stats = [
    { label: "Total livraisons", value: "1 248" },
    { label: "Taux de réussite", value: "98.4%" },
    { label: "Note moyenne", value: "4.8 ★" },
    { label: "Revenus ce mois", value: "245 000 MGA" },
  ];

  const menuItems = [
    { icon: "bell", label: "Notifications", screen: SCREENS.NOTIFICATIONS },
    { icon: "history", label: "Historique", screen: SCREENS.HISTORY },
    { icon: "wallet", label: "Revenus & Paiements", screen: null },
    { icon: "settings", label: "Paramètres", screen: null },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, #0D1525 0%, ${COLORS.bg} 100%)`,
        padding: "52px 20px 24px",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </button>
        </div>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: 28,
          background: `linear-gradient(135deg, ${COLORS.accent}, #B45309)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          color: "#fff",
          fontSize: 36,
          margin: "0 auto 14px",
          boxShadow: `0 10px 30px ${COLORS.accent}40`,
        }}>T</div>
        <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Toky Randria</h2>
        <p style={{ color: COLORS.muted, fontSize: 13, margin: "0 0 4px" }}>Livreur · ID: DRV-00142</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
          <p style={{ color: COLORS.green, fontSize: 12, fontWeight: 600, margin: 0 }}>En ligne</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 14 }}>
              <p style={{ color: COLORS.text, fontWeight: 800, fontSize: 18, margin: 0 }}>{s.value}</p>
              <p style={{ color: COLORS.muted, fontSize: 11, margin: "4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden" }}>
          {menuItems.map((item, i) => (
            <div key={item.label}>
              <div
                onClick={() => item.screen && onNavigate(item.screen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 16px",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.cardLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={18} color={COLORS.muted} />
                </div>
                <p style={{ color: COLORS.text, fontWeight: 600, fontSize: 14, flex: 1, margin: 0 }}>{item.label}</p>
                <Icon name="arrow" size={16} color={COLORS.muted} />
              </div>
              {i < menuItems.length - 1 && <div style={{ height: 1, background: COLORS.border, marginLeft: 68 }} />}
            </div>
          ))}
        </div>

        <button
          style={{
            width: "100%",
            marginTop: 16,
            background: "#1C0A0A",
            border: `1px solid ${COLORS.red}30`,
            borderRadius: 14,
            padding: "14px",
            color: COLORS.red,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

// ─── Notifications Screen ─────────────────────────────────────────────────────
const NotificationsScreen = ({ onNavigate }) => {
  const notifications = [
    { id: 1, icon: "📦", title: "Nouvelle commande assignée", desc: "LIV-2848 · Fanja Rasolofo · Isoraka", time: "Il y a 5 min", unread: true },
    { id: 2, icon: "⚡", title: "Livraison express prioritaire", desc: "LIV-2847 en attente de démarrage", time: "Il y a 12 min", unread: true },
    { id: 3, icon: "✅", title: "Livraison confirmée", desc: "LIV-2843 · Hery Raharison livré avec succès", time: "Il y a 1h", unread: false },
    { id: 4, icon: "⭐", title: "Nouvelle évaluation reçue", desc: "Hery Raharison vous a donné 5/5", time: "Il y a 1h", unread: false },
    { id: 5, icon: "💰", title: "Paiement reçu", desc: "45 000 MGA crédité sur votre compte", time: "Il y a 2h", unread: false },
    { id: 6, icon: "🗺️", title: "Itinéraire optimisé", desc: "Nouveau trajet suggéré pour 3 livraisons", time: "Il y a 3h", unread: false },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 20px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </button>
          <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, margin: 0, flex: 1 }}>Notifications</h2>
          <span style={{ background: COLORS.accent + "20", border: `1px solid ${COLORS.accent}40`, borderRadius: 10, padding: "3px 10px", color: COLORS.accent, fontSize: 12, fontWeight: 700 }}>2 nouvelles</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            background: n.unread ? COLORS.card : "transparent",
            border: `1px solid ${n.unread ? COLORS.accent + "20" : "transparent"}`,
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 8,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            cursor: "pointer",
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: COLORS.cardLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ color: COLORS.text, fontWeight: n.unread ? 700 : 500, fontSize: 13, margin: 0, flex: 1 }}>{n.title}</p>
                {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, flexShrink: 0, marginTop: 3, marginLeft: 8 }} />}
              </div>
              <p style={{ color: COLORS.muted, fontSize: 12, margin: "3px 0 4px" }}>{n.desc}</p>
              <p style={{ color: COLORS.muted, fontSize: 10, margin: 0 }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Scanner Screen ───────────────────────────────────────────────────────────
const ScannerScreen = ({ onNavigate }) => {
  const [scanned, setScanned] = useState(false);

  return (
    <div style={{ height: "100%", background: "#000", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Header */}
      <div style={{ width: "100%", padding: "52px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => onNavigate(SCREENS.HOME)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="arrowLeft" size={18} color="#fff" />
        </button>
        <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>Scanner le colis</h2>
      </div>

      {/* Viewfinder */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "20px" }}>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          {/* Camera bg */}
          <div style={{
            width: "100%", height: "100%", borderRadius: 20,
            background: "linear-gradient(135deg, #0A1520, #0D2030)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative",
          }}>
            {/* Scan line animation */}
            {!scanned && (
              <div style={{
                position: "absolute", left: 20, right: 20, height: 2,
                background: COLORS.accent,
                top: "40%",
                boxShadow: `0 0 12px ${COLORS.accent}`,
                animation: "scanline 2s ease-in-out infinite",
              }} />
            )}
            {scanned ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>✅</div>
                <p style={{ color: COLORS.green, fontWeight: 800, fontSize: 18, margin: 0 }}>Scanné !</p>
                <p style={{ color: COLORS.muted, fontSize: 13, margin: "6px 0 0" }}>LIV-2847 · Confirmé</p>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Icon name="scan" size={60} color={COLORS.muted} />
                <p style={{ color: COLORS.muted, fontSize: 13, margin: "12px 0 0" }}>Pointez vers le QR code</p>
              </div>
            )}
          </div>

          {/* Corner decorations */}
          {[
            { top: 0, left: 0, borderTop: `3px solid ${COLORS.accent}`, borderLeft: `3px solid ${COLORS.accent}` },
            { top: 0, right: 0, borderTop: `3px solid ${COLORS.accent}`, borderRight: `3px solid ${COLORS.accent}` },
            { bottom: 0, left: 0, borderBottom: `3px solid ${COLORS.accent}`, borderLeft: `3px solid ${COLORS.accent}` },
            { bottom: 0, right: 0, borderBottom: `3px solid ${COLORS.accent}`, borderRight: `3px solid ${COLORS.accent}` },
          ].map((style, i) => (
            <div key={i} style={{ position: "absolute", width: 24, height: 24, borderRadius: 2, ...style }} />
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", marginTop: 24 }}>
          Scannez le code QR ou code-barres du colis pour confirmer la livraison
        </p>

        <button
          onClick={() => setScanned(true)}
          style={{
            marginTop: 20,
            background: scanned ? COLORS.green : COLORS.accent,
            border: "none",
            borderRadius: 14,
            padding: "14px 32px",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          {scanned ? "✓ Livraison confirmée" : "Simuler le scan"}
        </button>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 20%; opacity: 1; }
          50% { top: 80%; opacity: 0.6; }
          100% { top: 20%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const BottomNav = ({ current, onNavigate }) => {
  const tabs = [
    { id: SCREENS.HOME, icon: "home", label: "Accueil" },
    { id: SCREENS.MAP, icon: "map", label: "Carte" },
    { id: SCREENS.HISTORY, icon: "history", label: "Historique" },
    { id: SCREENS.PROFILE, icon: "user", label: "Profil" },
  ];

  const showNav = [SCREENS.HOME, SCREENS.MAP, SCREENS.HISTORY, SCREENS.PROFILE].includes(current);
  if (!showNav) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: COLORS.card,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        paddingBottom: 8,
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const active = current === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "10px 4px 4px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Icon name={tab.icon} size={22} color={active ? COLORS.accent : COLORS.muted} />
            <p
              style={{
                color: active ? COLORS.accent : COLORS.muted,
                fontSize: 10,
                margin: 0,
                fontWeight: active ? 700 : 400,
              }}
            >
              {tab.label}
            </p>
            {active && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.accent }} />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.HOME:
        return <HomeScreen onNavigate={setScreen} onSelectDelivery={setSelectedDelivery} />;
      case SCREENS.DELIVERY_DETAIL:
        return <DeliveryDetailScreen delivery={selectedDelivery} onNavigate={setScreen} />;
      case SCREENS.MAP:
        return <MapScreen onNavigate={setScreen} />;
      case SCREENS.HISTORY:
        return <HistoryScreen onNavigate={setScreen} onSelectDelivery={setSelectedDelivery} />;
      case SCREENS.PROFILE:
        return <ProfileScreen onNavigate={setScreen} />;
      case SCREENS.NOTIFICATIONS:
        return <NotificationsScreen onNavigate={setScreen} />;
      case SCREENS.SCANNER:
        return <ScannerScreen onNavigate={setScreen} />;
      default:
        return <HomeScreen onNavigate={setScreen} onSelectDelivery={setSelectedDelivery} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#050810",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: inherit; }
        a { font-family: inherit; }
      `}</style>

      {/* Phone frame */}
      <div
        style={{
          width: 390,
          height: 844,
          background: COLORS.bg,
          borderRadius: 50,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 8px #1A1A2E, 0 0 0 10px #0D0D1A",
          border: "1px solid #2A2A4A",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            pointerEvents: "none",
          }}
        >
          <p style={{ color: COLORS.text, fontSize: 13, fontWeight: 700, margin: 0 }}>9:41</p>
          <div style={{ width: 120, height: 32, background: "#000", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0 }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Icon name="lightning" size={12} color={COLORS.text} />
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3].map((b) => <div key={b} style={{ width: 3, height: 10 + b * 2, background: COLORS.text, borderRadius: 1 }} />)}
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {renderScreen()}
        </div>

        {/* Bottom nav */}
        <BottomNav current={screen} onNavigate={setScreen} />
      </div>

      {/* Screen label */}
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, margin: 0 }}>
          Système de Livraison Intelligente · Interface Livreur
        </p>
      </div>
    </div>
  );
}
