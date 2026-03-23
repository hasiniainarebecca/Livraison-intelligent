import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Animated,
  Linking,
  Platform,
  Dimensions,
} from "react-native";
import { Svg, Path, Polygon, Polyline, Line, Rect, Circle, G } from "react-native-svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Colors ───────────────────────────────────────────────────────────────────
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
    id: "LIV-2847", client: "Aina Rakoto", phone: "+261 34 12 345 67",
    address: "Lot IVN 45, Analamahitsy, Antananarivo",
    distance: "3.2 km", eta: "12 min", type: "Express", status: "En cours",
    items: 2, weight: "1.4 kg", note: "Sonner deux fois",
    coords: { lat: -18.8792, lng: 47.5079 }, time: "14:30",
  },
  {
    id: "LIV-2848", client: "Fanja Rasolofo", phone: "+261 33 98 765 43",
    address: "Rue Pasteur, Isoraka, Antananarivo",
    distance: "5.8 km", eta: "22 min", type: "Standard", status: "En attente",
    items: 4, weight: "3.1 kg", note: "",
    coords: { lat: -18.9105, lng: 47.5389 }, time: "15:00",
  },
  {
    id: "LIV-2849", client: "Mamy Andriamaro", phone: "+261 32 56 789 01",
    address: "Ankadimbahoaka, Antananarivo",
    distance: "7.4 km", eta: "31 min", type: "Standard", status: "En attente",
    items: 1, weight: "0.8 kg", note: "Appeler à l'arrivée",
    coords: { lat: -18.9501, lng: 47.5205 }, time: "15:45",
  },
  {
    id: "LIV-2843", client: "Hery Raharison", phone: "+261 34 45 678 90",
    address: "Tsaralalana, Antananarivo",
    distance: "2.1 km", eta: "—", type: "Express", status: "Livré",
    items: 3, weight: "2.2 kg", note: "",
    coords: { lat: -18.9107, lng: 47.5373 }, time: "13:15",
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

// ─── SVG Icon ─────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = COLORS.text }) => {
  const props = { stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
  const icons = {
    home: <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...props} />,
    map: <><Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" {...props} /><Line x1="8" y1="2" x2="8" y2="18" {...props} /><Line x1="16" y1="6" x2="16" y2="22" {...props} /></>,
    package: <><Line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...props} /><Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" {...props} /><Polyline points="3.27 6.96 12 12.01 20.73 6.96" {...props} /><Line x1="12" y1="22.08" x2="12" y2="12" {...props} /></>,
    bell: <><Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" {...props} /><Path d="M13.73 21a2 2 0 01-3.46 0" {...props} /></>,
    user: <><Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...props} /><Circle cx="12" cy="7" r="4" {...props} /></>,
    history: <><Polyline points="12 8 12 12 14 14" {...props} /><Path d="M3.05 11a9 9 0 1 0 .5-4.5" {...props} /><Polyline points="3 3 3 7 7 7" {...props} /></>,
    check: <Polyline points="20 6 9 17 4 12" {...props} />,
    phone: <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.93 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" {...props} />,
    navigation: <Polygon points="3 11 22 2 13 21 11 13 3 11" {...props} />,
    scan: <><Polyline points="23 7 23 1 17 1" {...props} /><Line x1="17" y1="7" x2="23" y2="1" {...props} /><Polyline points="1 17 1 23 7 23" {...props} /><Line x1="7" y1="17" x2="1" y2="23" {...props} /><Polyline points="1 7 1 1 7 1" {...props} /><Line x1="7" y1="1" x2="1" y2="7" {...props} /><Polyline points="23 17 23 23 17 23" {...props} /><Line x1="17" y1="23" x2="23" y2="17" {...props} /></>,
    arrow: <Polyline points="9 18 15 12 9 6" {...props} />,
    arrowLeft: <Polyline points="15 18 9 12 15 6" {...props} />,
    star: <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...props} />,
    truck: <><Rect x="1" y="3" width="15" height="13" {...props} /><Polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...props} /><Circle cx="5.5" cy="18.5" r="2.5" {...props} /><Circle cx="18.5" cy="18.5" r="2.5" {...props} /></>,
    lightning: <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...props} />,
    close: <><Line x1="18" y1="6" x2="6" y2="18" {...props} /><Line x1="6" y1="6" x2="18" y2="18" {...props} /></>,
    settings: <><Circle cx="12" cy="12" r="3" {...props} /><Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...props} /></>,
    location: <><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" {...props} /><Circle cx="12" cy="10" r="3" {...props} /></>,
    wallet: <><Rect x="2" y="5" width="20" height="14" rx="2" {...props} /><Line x1="2" y1="10" x2="22" y2="10" {...props} /><Circle cx="17" cy="15" r="1" {...props} /></>,
    menu: <><Line x1="3" y1="12" x2="21" y2="12" {...props} /><Line x1="3" y1="6" x2="21" y2="6" {...props} /><Line x1="3" y1="18" x2="21" y2="18" {...props} /></>,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {icons[name]}
    </Svg>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, small = false }) => {
  const s = statusColors[status] || statusColors["En attente"];
  return (
    <View style={{
      backgroundColor: s.bg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: s.dot + "30",
      paddingHorizontal: small ? 8 : 12,
      paddingVertical: small ? 2 : 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    }}>
      <View style={{
        width: small ? 5 : 6,
        height: small ? 5 : 6,
        borderRadius: 10,
        backgroundColor: s.dot,
      }} />
      <Text style={{
        color: s.text,
        fontSize: small ? 10 : 11,
        fontWeight: "700",
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}>{status}</Text>
    </View>
  );
};

// ─── Home Screen ──────────────────────────────────────────────────────────────
const HomeScreen = ({ onNavigate, onSelectDelivery }) => {
  const [isOnline, setIsOnline] = useState(true);
  const active = deliveries.filter((d) => d.status === "En cours");
  const pending = deliveries.filter((d) => d.status === "En attente");
  const done = deliveries.filter((d) => d.status === "Livré");

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 52, backgroundColor: "#0D1525" }}>
        <View style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200, borderRadius: 100,
          backgroundColor: COLORS.accent + "08",
          borderWidth: 1, borderColor: COLORS.accent + "15",
        }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ color: COLORS.muted, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Bonjour 👋</Text>
            <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: "800", marginTop: 4, letterSpacing: -0.5 }}>Toky Randria</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.NOTIFICATIONS)}
              style={{
                backgroundColor: COLORS.card, borderRadius: 12,
                width: 40, height: 40, alignItems: "center", justifyContent: "center",
                borderWidth: 1, borderColor: COLORS.border,
              }}
            >
              <Icon name="bell" size={18} color={COLORS.text} />
              <View style={{
                position: "absolute", top: 8, right: 8,
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: COLORS.accent, borderWidth: 2, borderColor: COLORS.card,
              }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.PROFILE)}
              style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: COLORS.accent,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>T</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Online Toggle */}
        <View style={{
          marginTop: 20, backgroundColor: COLORS.card,
          borderRadius: 16, padding: 12,
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          borderWidth: 1, borderColor: isOnline ? COLORS.green + "40" : COLORS.border,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{
              width: 10, height: 10, borderRadius: 5,
              backgroundColor: isOnline ? COLORS.green : COLORS.muted,
            }} />
            <View>
              <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 14 }}>
                {isOnline ? "En ligne" : "Hors ligne"}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                {isOnline ? "Disponible pour les livraisons" : "Vous ne recevrez pas de commandes"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsOnline(!isOnline)}
            style={{
              width: 48, height: 26, borderRadius: 13,
              backgroundColor: isOnline ? COLORS.green : COLORS.border,
              justifyContent: "center",
            }}
          >
            <View style={{
              position: "absolute",
              left: isOnline ? 25 : 3,
              width: 20, height: 20, borderRadius: 10,
              backgroundColor: "#fff",
              shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4,
            }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "Aujourd'hui", value: done.length + active.length, unit: "livraisons", icon: "truck", color: COLORS.teal },
            { label: "Revenus", value: "48 500", unit: "MGA", icon: "wallet", color: COLORS.accent },
            { label: "Note", value: "4.8", unit: "/ 5", icon: "star", color: COLORS.yellow },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: COLORS.card, borderRadius: 16,
              padding: 14, alignItems: "center",
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              <Icon name={stat.icon} size={20} color={stat.color} />
              <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 18, marginTop: 8 }}>{stat.value}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 10 }}>{stat.unit}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 9, letterSpacing: 0.5 }}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Active Delivery */}
      {active.length > 0 && (
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>🚀 Livraison en cours</Text>
          {active.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => { onSelectDelivery(d); onNavigate(SCREENS.DELIVERY_DETAIL); }}
              style={{
                backgroundColor: COLORS.card, borderRadius: 20, padding: 16,
                borderWidth: 1, borderColor: "#38BDF840",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <View>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>{d.id}</Text>
                  <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "700", marginTop: 2 }}>{d.client}</Text>
                </View>
                <StatusBadge status={d.status} />
              </View>
              <View style={{
                backgroundColor: COLORS.cardLight, borderRadius: 12,
                padding: 10, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12,
              }}>
                <Icon name="location" size={16} color={COLORS.accent} />
                <Text style={{ color: COLORS.text, fontSize: 13, flex: 1 }}>{d.address}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: COLORS.cardLight, borderRadius: 10, padding: 8, alignItems: "center" }}>
                  <Text style={{ color: COLORS.accent, fontWeight: "800", fontSize: 16 }}>{d.eta}</Text>
                  <Text style={{ color: COLORS.muted, fontSize: 10 }}>ETA</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: COLORS.cardLight, borderRadius: 10, padding: 8, alignItems: "center" }}>
                  <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 16 }}>{d.distance}</Text>
                  <Text style={{ color: COLORS.muted, fontSize: 10 }}>Distance</Text>
                </View>
                <TouchableOpacity
                  onPress={() => onNavigate(SCREENS.MAP)}
                  style={{
                    flex: 1, backgroundColor: COLORS.accent, borderRadius: 10,
                    alignItems: "center", justifyContent: "center", gap: 4, flexDirection: "row",
                  }}
                >
                  <Icon name="navigation" size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Naviguer</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Pending Deliveries */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700" }}>📦 En attente ({pending.length})</Text>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HISTORY)}>
            <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: "600" }}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 10 }}>
          {pending.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => { onSelectDelivery(d); onNavigate(SCREENS.DELIVERY_DETAIL); }}
              style={{
                backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
                flexDirection: "row", alignItems: "center", gap: 12,
                borderWidth: 1, borderColor: COLORS.border,
              }}
            >
              <View style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: COLORS.cardLight, alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="package" size={20} color={COLORS.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 14 }}>{d.client}</Text>
                  <StatusBadge status={d.status} small />
                </View>
                <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 3 }} numberOfLines={1}>{d.address}</Text>
                <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>📍 {d.distance}</Text>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>⏱ {d.eta}</Text>
                  {d.type === "Express" && <Text style={{ color: COLORS.accent, fontSize: 11, fontWeight: "600" }}>⚡ Express</Text>}
                </View>
              </View>
              <Icon name="arrow" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ─── Delivery Detail Screen ───────────────────────────────────────────────────
const DeliveryDetailScreen = ({ delivery, onNavigate }) => {
  const [status, setStatus] = useState(delivery?.status || "En attente");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!delivery) return null;

  const handleAction = () => {
    if (status === "Livré") return;
    if (status === "En cours") setShowConfirm(true);
    else setStatus("En cours");
  };

  const stages = ["En attente", "En cours", "Livré"];
  const currentIdx = stages.indexOf(status);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 52, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.cardLight, borderRadius: 10,
              width: 36, height: 36, alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.muted, fontSize: 11 }}>Livraison</Text>
            <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "800" }}>{delivery.id}</Text>
          </View>
          <StatusBadge status={status} />
        </View>

        {/* Progress Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {stages.map((s, i) => (
            <View key={s} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <View style={{
                flex: 1, height: 4, borderRadius: 2,
                backgroundColor: i <= currentIdx ? COLORS.accent : COLORS.border,
              }} />
              {i < 2 && <View style={{ width: 4 }} />}
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
          {stages.map((s) => (
            <Text key={s} style={{
              color: status === s ? COLORS.accent : COLORS.muted,
              fontSize: 9, fontWeight: status === s ? "700" : "400",
            }}>{s}</Text>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
        {/* Client */}
        <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Client</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: COLORS.teal + "40", borderWidth: 1, borderColor: COLORS.teal + "40",
              alignItems: "center", justifyContent: "center",
            }}>
              <Text style={{ color: COLORS.teal, fontWeight: "800", fontSize: 18 }}>{delivery.client[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 16 }}>{delivery.client}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{delivery.phone}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${delivery.phone}`)}
              style={{
                backgroundColor: COLORS.green + "20", borderRadius: 10,
                width: 40, height: 40, alignItems: "center", justifyContent: "center",
                borderWidth: 1, borderColor: COLORS.green + "40",
              }}
            >
              <Icon name="phone" size={18} color={COLORS.green} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address */}
        <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Adresse de livraison</Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: COLORS.accent + "20",
              alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="location" size={18} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: "600" }}>{delivery.address}</Text>
              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>📍 {delivery.distance}</Text>
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>⏱ ETA: {delivery.eta}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.MAP)}
            style={{
              marginTop: 12, backgroundColor: COLORS.cardLight,
              borderRadius: 10, padding: 10, flexDirection: "row",
              alignItems: "center", justifyContent: "center", gap: 6,
              borderWidth: 1, borderColor: COLORS.accent + "30",
            }}
          >
            <Icon name="navigation" size={15} color={COLORS.accent} />
            <Text style={{ color: COLORS.accent, fontWeight: "700", fontSize: 13 }}>Ouvrir la navigation</Text>
          </TouchableOpacity>
        </View>

        {/* Package */}
        <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Colis</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { label: "Articles", value: delivery.items },
              { label: "Poids", value: delivery.weight },
              { label: "Type", value: delivery.type },
            ].map((info) => (
              <View key={info.label} style={{
                flex: 1, backgroundColor: COLORS.cardLight,
                borderRadius: 10, padding: 10, alignItems: "center",
              }}>
                <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 15 }}>{info.value}</Text>
                <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 2 }}>{info.label}</Text>
              </View>
            ))}
          </View>
          {!!delivery.note && (
            <View style={{
              backgroundColor: "#1A1500", borderRadius: 10, padding: 10, marginTop: 10,
              flexDirection: "row", gap: 8,
              borderWidth: 1, borderColor: COLORS.yellow + "30",
            }}>
              <Text style={{ fontSize: 14 }}>📝</Text>
              <Text style={{ color: COLORS.yellow, fontSize: 12 }}>{delivery.note}</Text>
            </View>
          )}
        </View>

        {/* Scanner Button */}
        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.SCANNER)}
          style={{
            backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            borderWidth: 1, borderColor: COLORS.border,
          }}
        >
          <Icon name="scan" size={18} color={COLORS.muted} />
          <Text style={{ color: COLORS.text, fontWeight: "600", fontSize: 14 }}>Scanner le code de confirmation</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Action Button */}
      <View style={{ padding: 20, paddingBottom: 32, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        {status !== "Livré" ? (
          <TouchableOpacity
            onPress={handleAction}
            style={{
              borderRadius: 16, padding: 16,
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
              backgroundColor: status === "En cours" ? COLORS.green : COLORS.accent,
            }}
          >
            <Icon name={status === "En cours" ? "check" : "truck"} size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              {status === "En cours" ? "Confirmer la livraison" : "Démarrer la livraison"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ alignItems: "center", padding: 16 }}>
            <Text style={{ fontSize: 32, marginBottom: 4 }}>✅</Text>
            <Text style={{ color: COLORS.green, fontWeight: "700", fontSize: 16 }}>Livraison confirmée !</Text>
          </View>
        )}
      </View>

      {/* Confirm Modal */}
      {showConfirm && (
        <View style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end",
        }}>
          <View style={{
            backgroundColor: COLORS.card, borderRadius: 24, padding: 24, paddingBottom: 40,
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>📦</Text>
              <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "800", marginBottom: 8 }}>Confirmer la livraison ?</Text>
              <Text style={{ color: COLORS.muted, fontSize: 14, textAlign: "center" }}>Cette action est irréversible. Le client sera notifié.</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                style={{
                  flex: 1, backgroundColor: COLORS.cardLight, borderRadius: 14, padding: 14,
                  alignItems: "center", borderWidth: 1, borderColor: COLORS.border,
                }}
              >
                <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 15 }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setStatus("Livré"); setShowConfirm(false); }}
                style={{ flex: 1, backgroundColor: COLORS.green, borderRadius: 14, padding: 14, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>✓ Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── Map Screen ───────────────────────────────────────────────────────────────
const MapScreen = ({ onNavigate }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const activeDelivery = deliveries.find((d) => d.status === "En cours");
  const W = SCREEN_WIDTH;
  const H = SCREEN_HEIGHT;

  const dots = [
    { x: W * 0.52, y: H * 0.42, color: COLORS.accent, label: "Vous" },
    { x: W * 0.72, y: H * 0.28, color: COLORS.teal, label: activeDelivery?.client },
    { x: W * 0.30, y: H * 0.62, color: COLORS.yellow, label: "En attente" },
  ];

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1520" }}>
      {/* Map Background */}
      <Svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} viewBox={`0 0 ${W} ${H}`}>
        {/* Grid */}
        {Array.from({ length: 20 }).map((_, i) => (
          <G key={i} opacity={0.15}>
            <Line x1={i * W / 18} y1="0" x2={i * W / 18} y2={H} stroke={COLORS.teal} strokeWidth="0.5" />
            <Line x1="0" y1={i * H / 18} x2={W} y2={i * H / 18} stroke={COLORS.teal} strokeWidth="0.5" />
          </G>
        ))}
        {/* Roads */}
        <Line x1={W * 0.3} y1="0" x2={W * 0.52} y2={H * 0.42} stroke="#1E3A4A" strokeWidth="12" />
        <Line x1={W * 0.52} y1={H * 0.42} x2={W * 0.72} y2={H * 0.28} stroke="#1E3A4A" strokeWidth="8" strokeDasharray="12,6" />
        <Line x1={W * 0.52} y1={H * 0.42} x2={W * 0.30} y2={H * 0.62} stroke="#1E3A4A" strokeWidth="8" />
        <Line x1="0" y1={H * 0.55} x2={W} y2={H * 0.55} stroke="#162030" strokeWidth="10" />
        <Line x1={W * 0.60} y1="0" x2={W * 0.60} y2={H} stroke="#162030" strokeWidth="10" />
        {/* Route highlight */}
        <Line x1={W * 0.52} y1={H * 0.42} x2={W * 0.72} y2={H * 0.28} stroke={COLORS.accent} strokeWidth="3" strokeDasharray="8,4" opacity="0.8" />
        {/* Buildings */}
        {[[0.10, 0.20], [0.15, 0.35], [0.75, 0.60], [0.80, 0.40], [0.40, 0.70], [0.85, 0.75]].map(([x, y], i) => (
          <Rect key={i} x={W * x} y={H * y} width={W * 0.06} height={H * 0.05} rx="3" fill="#162535" stroke="#1E3A4A" strokeWidth="1" />
        ))}
        {/* Dots */}
        {dots.map((dot, i) => (
          <G key={i}>
            <Circle cx={dot.x} cy={dot.y} r="20" fill={dot.color} fillOpacity="0.08" />
            <Circle cx={dot.x} cy={dot.y} r="12" fill={dot.color} fillOpacity="0.15" />
            <Circle cx={dot.x} cy={dot.y} r="7" fill={dot.color} />
            <Circle cx={dot.x} cy={dot.y} r="3" fill="#fff" />
          </G>
        ))}
      </Svg>

      {/* Pulse */}
      <Animated.View style={{
        position: "absolute",
        left: W * 0.52 - 30,
        top: H * 0.42 - 30,
        width: 60, height: 60, borderRadius: 30,
        borderWidth: 2, borderColor: COLORS.accent,
        transform: [{ scale: pulseScale }],
        opacity: pulseOpacity,
      }} />

      {/* Header */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, padding: 20, paddingTop: 52 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.card + "CC", borderRadius: 10,
              width: 36, height: 36, alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{
            flex: 1, backgroundColor: COLORS.card + "CC",
            borderRadius: 12, padding: 10,
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            <Text style={{ color: COLORS.muted, fontSize: 10 }}>Destination</Text>
            <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>
              {activeDelivery?.address || "Aucune livraison active"}
            </Text>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={{
        position: "absolute", right: 20, top: "50%",
        backgroundColor: COLORS.card + "CC", borderRadius: 12, padding: 12,
        borderWidth: 1, borderColor: COLORS.border, gap: 12,
      }}>
        {[
          { color: COLORS.accent, label: "Vous" },
          { color: COLORS.teal, label: "Client" },
          { color: COLORS.yellow, label: "File" },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
            <Text style={{ color: COLORS.muted, fontSize: 9 }}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Panel */}
      {activeDelivery && (
        <View style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          backgroundColor: COLORS.card + "F0",
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 16, paddingBottom: 32,
          borderTopWidth: 1, borderTopColor: COLORS.border,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
            <View>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>ETA</Text>
              <Text style={{ color: COLORS.accent, fontSize: 28, fontWeight: "800" }}>{activeDelivery.eta}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>Distance</Text>
              <Text style={{ color: COLORS.text, fontSize: 28, fontWeight: "800" }}>{activeDelivery.distance}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${activeDelivery.phone}`)}
              style={{
                flex: 1, backgroundColor: COLORS.cardLight, borderRadius: 14, padding: 12,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                borderWidth: 1, borderColor: COLORS.border,
              }}
            >
              <Icon name="phone" size={16} color={COLORS.green} />
              <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 14 }}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 2, backgroundColor: COLORS.accent, borderRadius: 14, padding: 12,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Icon name="navigation" size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>Lancer la navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── History Screen ───────────────────────────────────────────────────────────
const HistoryScreen = ({ onNavigate, onSelectDelivery }) => {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "Livré", "En cours", "En attente", "Annulé"];
  const filtered = filter === "Tous" ? deliveries : deliveries.filter((d) => d.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ padding: 20, paddingTop: 52, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.card, borderRadius: 10,
              width: 36, height: 36, alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: "800" }}>Historique</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                backgroundColor: filter === f ? COLORS.accent : COLORS.card,
                borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
                borderWidth: 1, borderColor: filter === f ? COLORS.accent : COLORS.border,
              }}
            >
              <Text style={{ color: filter === f ? "#fff" : COLORS.muted, fontWeight: filter === f ? "700" : "400", fontSize: 12 }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false}>
        {filtered.map((d) => (
          <TouchableOpacity
            key={d.id}
            onPress={() => { onSelectDelivery(d); onNavigate(SCREENS.DELIVERY_DETAIL); }}
            style={{
              backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <View>
                <Text style={{ color: COLORS.muted, fontSize: 11 }}>{d.id} · {d.time}</Text>
                <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700", marginTop: 3 }}>{d.client}</Text>
              </View>
              <StatusBadge status={d.status} small />
            </View>
            <Text style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>{d.address}</Text>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>📦 {d.items} articles</Text>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>⚖️ {d.weight}</Text>
              {d.type === "Express" && <Text style={{ color: COLORS.accent, fontSize: 11, fontWeight: "600" }}>⚡ Express</Text>}
              <View style={{ flex: 1 }} />
              <Icon name="arrow" size={14} color={COLORS.muted} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ backgroundColor: "#0D1525", padding: 20, paddingTop: 52, alignItems: "center" }}>
        <View style={{ alignSelf: "flex-start", marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.card, borderRadius: 10,
              width: 36, height: 36, alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={{
          width: 90, height: 90, borderRadius: 28,
          backgroundColor: COLORS.accent,
          alignItems: "center", justifyContent: "center", marginBottom: 14,
        }}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 36 }}>T</Text>
        </View>
        <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: "800", marginBottom: 4 }}>Toky Randria</Text>
        <Text style={{ color: COLORS.muted, fontSize: 13, marginBottom: 4 }}>Livreur · ID: DRV-00142</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green }} />
          <Text style={{ color: COLORS.green, fontSize: 12, fontWeight: "600" }}>En ligne</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {stats.map((s) => (
            <View key={s.label} style={{
              width: "47%", backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 18 }}>{s.value}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={{ padding: 20 }}>
        <View style={{
          backgroundColor: COLORS.card, borderRadius: 16, overflow: "hidden",
          borderWidth: 1, borderColor: COLORS.border,
        }}>
          {menuItems.map((item, i) => (
            <View key={item.label}>
              <TouchableOpacity
                onPress={() => item.screen && onNavigate(item.screen)}
                style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 16 }}
              >
                <View style={{
                  width: 38, height: 38, borderRadius: 10,
                  backgroundColor: COLORS.cardLight, alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.icon} size={18} color={COLORS.muted} />
                </View>
                <Text style={{ color: COLORS.text, fontWeight: "600", fontSize: 14, flex: 1 }}>{item.label}</Text>
                <Icon name="arrow" size={16} color={COLORS.muted} />
              </TouchableOpacity>
              {i < menuItems.length - 1 && (
                <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 68 }} />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={{
          marginTop: 16, backgroundColor: "#1C0A0A", borderRadius: 14, padding: 14,
          alignItems: "center", borderWidth: 1, borderColor: COLORS.red + "30",
        }}>
          <Text style={{ color: COLORS.red, fontWeight: "700", fontSize: 14 }}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ padding: 20, paddingTop: 52, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.card, borderRadius: 10,
              width: 36, height: 36, alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: "800", flex: 1 }}>Notifications</Text>
          <View style={{
            backgroundColor: COLORS.accent + "20", borderRadius: 10,
            paddingHorizontal: 10, paddingVertical: 3,
            borderWidth: 1, borderColor: COLORS.accent + "40",
          }}>
            <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: "700" }}>2 nouvelles</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 8 }} showsVerticalScrollIndicator={false}>
        {notifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={{
              backgroundColor: n.unread ? COLORS.card : "transparent",
              borderRadius: 14, padding: 12,
              flexDirection: "row", alignItems: "flex-start", gap: 12,
              borderWidth: 1, borderColor: n.unread ? COLORS.accent + "20" : "transparent",
            }}
          >
            <View style={{
              width: 42, height: 42, borderRadius: 12,
              backgroundColor: COLORS.cardLight, alignItems: "center", justifyContent: "center",
            }}>
              <Text style={{ fontSize: 20 }}>{n.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ color: COLORS.text, fontWeight: n.unread ? "700" : "500", fontSize: 13, flex: 1 }}>{n.title}</Text>
                {n.unread && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, marginTop: 3, marginLeft: 8 }} />
                )}
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>{n.desc}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 4 }}>{n.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ─── Scanner Screen ───────────────────────────────────────────────────────────
const ScannerScreen = ({ onNavigate }) => {
  const [scanned, setScanned] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [scanned]);

  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center" }}>
      {/* Header */}
      <View style={{ width: "100%", padding: 20, paddingTop: 52, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.HOME)}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10,
            width: 36, height: 36, alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="arrowLeft" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Scanner le colis</Text>
      </View>

      {/* Viewfinder */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%", padding: 20 }}>
        <View style={{ position: "relative", width: 260, height: 260 }}>
          <View style={{
            width: "100%", height: "100%", borderRadius: 20,
            backgroundColor: "#0D2030", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {!scanned && (
              <Animated.View style={{
                position: "absolute", left: 20, right: 20, height: 2,
                backgroundColor: COLORS.accent,
                transform: [{ translateY: scanLineTranslate }],
              }} />
            )}
            {scanned ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 60, marginBottom: 12 }}>✅</Text>
                <Text style={{ color: COLORS.green, fontWeight: "800", fontSize: 18 }}>Scanné !</Text>
                <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}>LIV-2847 · Confirmé</Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Icon name="scan" size={60} color={COLORS.muted} />
                <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 12 }}>Pointez vers le QR code</Text>
              </View>
            )}
          </View>
          {/* Corner decorations */}
          {[
            { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
            { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
            { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
            { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
          ].map((style, i) => (
            <View key={i} style={{
              position: "absolute", width: 24, height: 24, borderRadius: 2,
              borderColor: COLORS.accent, ...style,
            }} />
          ))}
        </View>

        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", marginTop: 24 }}>
          Scannez le code QR ou code-barres du colis pour confirmer la livraison
        </Text>

        <TouchableOpacity
          onPress={() => setScanned(true)}
          style={{
            marginTop: 20, borderRadius: 14,
            paddingHorizontal: 32, paddingVertical: 14,
            backgroundColor: scanned ? COLORS.green : COLORS.accent,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
            {scanned ? "✓ Livraison confirmée" : "Simuler le scan"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    <View style={{
      flexDirection: "row",
      backgroundColor: COLORS.card,
      borderTopWidth: 1, borderTopColor: COLORS.border,
      paddingBottom: Platform.OS === "ios" ? 20 : 8,
    }}>
      {tabs.map((tab) => {
        const active = current === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onNavigate(tab.id)}
            style={{ flex: 1, alignItems: "center", paddingTop: 10, paddingBottom: 4, gap: 3 }}
          >
            <Icon name={tab.icon} size={22} color={active ? COLORS.accent : COLORS.muted} />
            <Text style={{ color: active ? COLORS.accent : COLORS.muted, fontSize: 10, fontWeight: active ? "700" : "400" }}>
              {tab.label}
            </Text>
            {active && (
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.accent }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Livreur() {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={{ flex: 1 }}>
        {renderScreen()}
        <BottomNav current={screen} onNavigate={setScreen} />
      </View>
    </SafeAreaView>
  );
}