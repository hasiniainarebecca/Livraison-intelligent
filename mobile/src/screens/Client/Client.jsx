import { useState, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  SafeAreaView, StatusBar, Platform, Linking, Animated,
  Dimensions, KeyboardAvoidingView,
} from "react-native";
import { Svg, Path, Polygon, Polyline, Line, Rect, Circle, G } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

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
  "En attente": { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B", border: "#FDE68A" },
  "Confirmée":  { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6", border: "#BFDBFE" },
  "En cours":   { bg: "#E8F5EF", text: "#15803D", dot: "#22C55E", border: "#86EFAC" },
  "Livré":      { bg: "#F0FDF4", text: "#166534", dot: "#22C55E", border: "#BBF7D0" },
  "Annulé":     { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444", border: "#FECACA" },
};

const SCREENS = {
  HOME: "home", NEW_ORDER: "new_order", TRACKING: "tracking",
  ORDER_DETAIL: "order_detail", HISTORY: "history",
  PROFILE: "profile", NOTIFICATIONS: "notifications",
  CONFIRM: "confirm", RATE: "rate",
};

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
const Icon = ({ name, size = 20, color = C.text }) => {
  const p = { stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
  const icons = {
    home:       <><Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...p}/><Polyline points="9 22 9 12 15 12 15 22" {...p}/></>,
    package:    <><Line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...p}/><Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" {...p}/><Polyline points="3.27 6.96 12 12.01 20.73 6.96" {...p}/><Line x1="12" y1="22.08" x2="12" y2="12" {...p}/></>,
    bell:       <><Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" {...p}/><Path d="M13.73 21a2 2 0 01-3.46 0" {...p}/></>,
    user:       <><Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...p}/><Circle cx="12" cy="7" r="4" {...p}/></>,
    history:    <><Polyline points="12 8 12 12 14 14" {...p}/><Path d="M3.05 11a9 9 0 1 0 .5-4.5" {...p}/><Polyline points="3 3 3 7 7 7" {...p}/></>,
    map:        <><Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" {...p}/><Line x1="8" y1="2" x2="8" y2="18" {...p}/><Line x1="16" y1="6" x2="16" y2="22" {...p}/></>,
    plus:       <><Line x1="12" y1="5" x2="12" y2="19" {...p}/><Line x1="5" y1="12" x2="19" y2="12" {...p}/></>,
    arrow:      <Polyline points="9 18 15 12 9 6" {...p}/>,
    arrowLeft:  <Polyline points="15 18 9 12 15 6" {...p}/>,
    check:      <Polyline points="20 6 9 17 4 12" {...p}/>,
    location:   <><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" {...p}/><Circle cx="12" cy="10" r="3" {...p}/></>,
    truck:      <><Rect x="1" y="3" width="15" height="13" {...p}/><Polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...p}/><Circle cx="5.5" cy="18.5" r="2.5" {...p}/><Circle cx="18.5" cy="18.5" r="2.5" {...p}/></>,
    phone:      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.93 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" {...p}/>,
    star:       <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...p}/>,
    starFilled: <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={color}/>,
    chat:       <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...p}/>,
    close:      <><Line x1="18" y1="6" x2="6" y2="18" {...p}/><Line x1="6" y1="6" x2="18" y2="18" {...p}/></>,
    lightning:  <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p}/>,
    wallet:     <><Rect x="2" y="5" width="20" height="14" rx="2" {...p}/><Line x1="2" y1="10" x2="22" y2="10" {...p}/><Circle cx="17" cy="15" r="1" {...p}/></>,
    settings:   <><Circle cx="12" cy="12" r="3" {...p}/><Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...p}/></>,
    navigation: <Polygon points="3 11 22 2 13 21 11 13 3 11" {...p}/>,
    edit:       <><Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...p}/><Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...p}/></>,
    shield:     <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/>,
    help:       <><Circle cx="12" cy="12" r="10" {...p}/><Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" {...p}/><Line x1="12" y1="17" x2="12.01" y2="17" {...p}/></>,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {icons[name]}
    </Svg>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, small = false }) => {
  const s = STATUS[status] || STATUS["En attente"];
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: 20, borderWidth: 1, borderColor: s.border, paddingHorizontal: small ? 8 : 12, paddingVertical: small ? 2 : 4, flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View style={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: 10, backgroundColor: s.dot }} />
      <Text style={{ color: s.text, fontSize: small ? 10 : 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" }}>{status}</Text>
    </View>
  );
};

// ─── Home Screen ──────────────────────────────────────────────────────────────
const HomeScreen = ({ onNavigate, onSelectOrder }) => {
  const active = ORDERS.filter(o => o.status === "En cours");
  const recent = ORDERS.filter(o => o.status === "Livré").slice(0, 2);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View style={{ backgroundColor: C.primary, padding: 22, paddingTop: 52, paddingBottom: 28, overflow: "hidden" }}>
        <View style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)" }} />
        <View style={{ position: "absolute", top: 20, right: 30, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.04)" }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 1 }}>BONJOUR 👋</Text>
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 4, letterSpacing: -0.5 }}>Lalaina Rabe</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => onNavigate(SCREENS.NOTIFICATIONS)}
              style={{ backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", borderRadius: 12, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
              <Icon name="bell" size={18} color="#fff" />
              <View style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent, borderWidth: 2, borderColor: C.primary }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate(SCREENS.PROFILE)}
              style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: "900", color: "#fff", fontSize: 16 }}>L</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New Order Button */}
        <TouchableOpacity onPress={() => onNavigate(SCREENS.NEW_ORDER)}
          style={{ backgroundColor: C.accent, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <Icon name="plus" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Nouvelle commande</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>Express ou standard, livraison rapide</Text>
          </View>
          <Icon name="arrow" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { emoji: "📦", value: "8", label: "Commandes" },
            { emoji: "✅", value: "6", label: "Livrées" },
            { emoji: "⭐", value: "4.9", label: "Ma note" },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 14, alignItems: "center", borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
              <Text style={{ color: C.text, fontWeight: "900", fontSize: 20, marginTop: 6 }}>{s.value}</Text>
              <Text style={{ color: C.muted, fontSize: 10 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Active Order */}
      {active.length > 0 && (
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Text style={{ color: C.text, fontSize: 15, fontWeight: "800", marginBottom: 12 }}>🚚 Commande en cours</Text>
          {active.map(order => (
            <TouchableOpacity key={order.id} onPress={() => { onSelectOrder(order); onNavigate(SCREENS.TRACKING); }}
              style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.primary + "30", borderRadius: 20, padding: 18 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: C.muted, fontSize: 11 }}>{order.id}</Text>
                  <Text style={{ color: C.text, fontSize: 17, fontWeight: "800", marginTop: 3 }} numberOfLines={1}>{order.items.map(i => i.name).join(", ")}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>

              {/* Progress bar */}
              <View style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: C.sub, fontSize: 12 }}>Progression</Text>
                  <Text style={{ color: C.primary, fontSize: 12, fontWeight: "700" }}>{order.progress}%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: C.bgDeep, borderRadius: 4, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: `${order.progress}%`, backgroundColor: C.primary, borderRadius: 4 }} />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ color: C.primary, fontWeight: "900", fontSize: 18 }}>{order.eta}</Text>
                  <Text style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>Arrivée estimée</Text>
                </View>
                <TouchableOpacity onPress={() => { onSelectOrder(order); onNavigate(SCREENS.TRACKING); }}
                  style={{ flex: 2, backgroundColor: C.primary, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon name="map" size={15} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>Suivre en direct</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Orders */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: C.text, fontSize: 15, fontWeight: "800" }}>Commandes récentes</Text>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HISTORY)}>
            <Text style={{ color: C.primary, fontSize: 12, fontWeight: "700" }}>Tout voir</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 10 }}>
          {recent.map(order => (
            <TouchableOpacity key={order.id} onPress={() => { onSelectOrder(order); onNavigate(SCREENS.ORDER_DETAIL); }}
              style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: C.primaryLt, alignItems: "center", justifyContent: "center" }}>
                <Icon name="package" size={22} color={C.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>{order.id}</Text>
                  <StatusBadge status={order.status} small />
                </View>
                <Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }} numberOfLines={1}>{order.items.map(i => i.name).join(", ")}</Text>
                <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{order.date}</Text>
              </View>
              <Icon name="arrow" size={16} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Promo Banner */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <View style={{ backgroundColor: C.accent, borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Offre spéciale</Text>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16, marginVertical: 4 }}>Livraison gratuite</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Pour toute commande {'>'} 50 000 MGA</Text>
          </View>
          <Text style={{ fontSize: 48 }}>🎁</Text>
        </View>
      </View>
    </ScrollView>
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

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header */}
      <View style={{ padding: 22, paddingTop: 52, paddingBottom: 20, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>Nouvelle commande</Text>
        </View>
        {/* Step Indicators */}
        <View style={{ flexDirection: "row", gap: 6 }}>
          {[1, 2, 3].map(s => (
            <View key={s} style={{ flex: 1 }}>
              <View style={{ height: 4, borderRadius: 2, backgroundColor: s <= step ? C.primary : C.bgDeep }} />
              <Text style={{ color: s <= step ? C.primary : C.muted, fontSize: 10, marginTop: 4, fontWeight: s === step ? "700" : "400" }}>
                {["Adresse", "Articles", "Résumé"][s - 1]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View>
            <Text style={{ color: C.sub, fontSize: 13, fontWeight: "600", marginBottom: 16 }}>Type de livraison</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
              {[
                { id: "standard", label: "Standard", desc: "2–4h", emoji: "📦", price: "2 000 MGA" },
                { id: "express", label: "Express", desc: "30–60 min", emoji: "⚡", price: "4 500 MGA" },
              ].map(t => (
                <TouchableOpacity key={t.id} onPress={() => setType(t.id)}
                  style={{ flex: 1, backgroundColor: type === t.id ? C.primaryLt : C.card, borderWidth: 2, borderColor: type === t.id ? C.primary : C.border, borderRadius: 16, padding: 16, alignItems: "center" }}>
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</Text>
                  <Text style={{ color: C.text, fontWeight: "800", fontSize: 15, marginBottom: 3 }}>{t.label}</Text>
                  <Text style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>{t.desc}</Text>
                  <Text style={{ color: type === t.id ? C.primary : C.muted, fontWeight: "700", fontSize: 12 }}>{t.price}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ color: C.sub, fontSize: 13, fontWeight: "600", marginBottom: 10 }}>Adresse de livraison</Text>
            <View style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: address ? C.primary : C.border, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Icon name="location" size={18} color={address ? C.primary : C.muted} />
              <TextInput value={address} onChangeText={setAddress} placeholder="Entrez l'adresse de livraison..." placeholderTextColor={C.muted}
                style={{ flex: 1, color: C.text, fontSize: 14 }} />
            </View>
            <Text style={{ color: C.muted, fontSize: 11, marginBottom: 8, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>Adresses récentes</Text>
            <View style={{ gap: 6 }}>
              {suggestions.map(s => (
                <TouchableOpacity key={s} onPress={() => setAddress(s)}
                  style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 10, flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Icon name="location" size={14} color={C.muted} />
                  <Text style={{ color: C.sub, fontSize: 13 }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ color: C.sub, fontSize: 13, fontWeight: "600", marginTop: 20, marginBottom: 10 }}>Note pour le livreur (optionnel)</Text>
            <TextInput value={note} onChangeText={setNote} placeholder="Ex: Sonner deux fois, 2e étage..." placeholderTextColor={C.muted}
              multiline numberOfLines={3}
              style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 12, color: C.text, fontSize: 13, minHeight: 80, textAlignVertical: "top" }} />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={{ color: C.sub, fontSize: 13, fontWeight: "600", marginBottom: 16 }}>Articles à livrer</Text>
            {items.map((item, i) => (
              <View key={i} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLt, alignItems: "center", justifyContent: "center" }}>
                    <Icon name="package" size={18} color={C.primary} />
                  </View>
                  <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>Article {i + 1}</Text>
                </View>
                <TextInput value={item.name}
                  onChangeText={v => { const n = [...items]; n[i].name = v; setItems(n); }}
                  placeholder="Description de l'article" placeholderTextColor={C.muted}
                  style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, color: C.text, fontSize: 13, marginBottom: 8 }} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: C.muted, fontSize: 12 }}>Quantité :</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: C.border }}>
                    <TouchableOpacity onPress={() => { const n = [...items]; n[i].qty = Math.max(1, n[i].qty - 1); setItems(n); }}>
                      <Text style={{ color: C.primary, fontWeight: "900", fontSize: 18 }}>−</Text>
                    </TouchableOpacity>
                    <Text style={{ color: C.text, fontWeight: "700", fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.qty}</Text>
                    <TouchableOpacity onPress={() => { const n = [...items]; n[i].qty += 1; setItems(n); }}>
                      <Text style={{ color: C.primary, fontWeight: "900", fontSize: 18 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={() => setItems([...items, { name: "", qty: 1 }])}
              style={{ backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border, borderStyle: "dashed", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="plus" size={16} color={C.primary} />
              <Text style={{ color: C.primary, fontWeight: "700", fontSize: 14 }}>Ajouter un article</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={{ color: C.sub, fontSize: 13, fontWeight: "600", marginBottom: 16 }}>Résumé de la commande</Text>
            <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <Text style={{ color: C.muted, fontSize: 12 }}>Type</Text>
                <View style={{ backgroundColor: type === "express" ? C.accentLt : C.primaryLt, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 }}>
                  <Text style={{ color: type === "express" ? C.accent : C.primary, fontSize: 12, fontWeight: "700" }}>
                    {type === "express" ? "⚡ Express" : "📦 Standard"}
                  </Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: C.border, marginVertical: 10 }} />
              <Text style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>Adresse</Text>
              <Text style={{ color: C.text, fontSize: 13, fontWeight: "600" }}>{address || "Non renseignée"}</Text>
              {!!note && (
                <>
                  <View style={{ height: 1, backgroundColor: C.border, marginVertical: 10 }} />
                  <Text style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>Note</Text>
                  <Text style={{ color: C.text, fontSize: 13 }}>{note}</Text>
                </>
              )}
            </View>
            <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <Text style={{ color: C.muted, fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: "600" }}>Articles</Text>
              {items.filter(i => i.name).map((item, idx) => (
                <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: C.text, fontSize: 13 }}>{item.name}</Text>
                  <Text style={{ color: C.muted, fontSize: 13 }}>×{item.qty}</Text>
                </View>
              ))}
              <View style={{ height: 1, backgroundColor: C.border, marginVertical: 12 }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={{ color: C.muted, fontSize: 13 }}>Frais de livraison</Text>
                <Text style={{ color: C.text, fontSize: 13, fontWeight: "600" }}>{type === "express" ? "4 500" : "2 000"} MGA</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: C.text, fontSize: 14, fontWeight: "800" }}>Total estimé</Text>
                <Text style={{ color: C.primary, fontSize: 15, fontWeight: "900" }}>{type === "express" ? "~46 500" : "~44 000"} MGA</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={{ padding: 22, paddingBottom: 32, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", gap: 10 }}>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)}
            style={{ flex: 1, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, alignItems: "center" }}>
            <Text style={{ color: C.text, fontWeight: "700", fontSize: 15 }}>Retour</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => { if (step < 3) setStep(step + 1); else onNavigate(SCREENS.CONFIRM); }}
          style={{ flex: 2, backgroundColor: C.primary, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {step === 3
            ? <><Icon name="check" size={18} color="#fff" /><Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Confirmer la commande</Text></>
            : <><Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Continuer</Text><Icon name="arrow" size={18} color="#fff" /></>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ─── Tracking Screen ──────────────────────────────────────────────────────────
const TrackingScreen = ({ order, onNavigate }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ])).start();
  }, []);

  if (!order) return null;

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Map */}
      <View style={{ flex: 1, position: "relative", backgroundColor: "#EEF4EE" }}>
        <Svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} viewBox={`0 0 ${W} ${H * 0.55}`}>
          <Rect width={W} height={H * 0.55} fill="#EEF4EE" />
          {[
            [0, H*0.3, W, H*0.3, 14],
            [W*0.4, 0, W*0.4, H*0.55, 12],
            [0, H*0.165, W*0.7, H*0.33, 10],
          ].map(([x1,y1,x2,y2,sw], i) => (
            <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4E4D4" strokeWidth={sw} />
          ))}
          <Line x1={W*0.35} y1={H*0.36} x2={W*0.65} y2={H*0.19} stroke={C.primary} strokeWidth="3" strokeDasharray="10,5" />
          {[[0.10,0.20],[0.20,0.60],[0.55,0.55],[0.75,0.30],[0.15,0.40]].map(([x,y],i) => (
            <Rect key={i} x={W*x} y={H*0.55*y} width={W*0.08} height={H*0.55*0.07} rx="4" fill="#D8EAD8" stroke="#C8DCC8" strokeWidth="1" />
          ))}
          {[[0.50,0.50],[0.30,0.30],[0.70,0.70]].map(([x,y],i) => (
            <Circle key={i} cx={W*x} cy={H*0.55*y} r="8" fill="#B8D4B8" opacity="0.6" />
          ))}
          {/* Destination */}
          <Circle cx={W*0.65} cy={H*0.55*0.35} r="14" fill={C.primary} fillOpacity="0.15" />
          <Circle cx={W*0.65} cy={H*0.55*0.35} r="9" fill={C.primary} />
          <Circle cx={W*0.65} cy={H*0.55*0.35} r="4" fill="#fff" />
          {/* Driver dot */}
          <Circle cx={W*0.35} cy={H*0.55*0.65} r="8" fill={C.accent} />
          <Circle cx={W*0.35} cy={H*0.55*0.65} r="3" fill="#fff" />
        </Svg>

        {/* Pulse animation */}
        <Animated.View style={{
          position: "absolute",
          left: W*0.35 - 20, top: H*0.55*0.65 - 20,
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: C.accent,
          transform: [{ scale: pulseScale }],
          opacity: pulseOpacity,
        }} />

        {/* Header overlay */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, padding: 20, paddingTop: 52 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
              style={{ backgroundColor: C.white + "CC", borderWidth: 1, borderColor: C.border, borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
              <Icon name="arrowLeft" size={18} color={C.text} />
            </TouchableOpacity>
            <View style={{ flex: 1, backgroundColor: C.white + "CC", borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 8, paddingHorizontal: 14 }}>
              <Text style={{ color: C.muted, fontSize: 10 }}>Suivi de</Text>
              <Text style={{ color: C.text, fontSize: 13, fontWeight: "700" }}>{order.id}</Text>
            </View>
            <StatusBadge status={order.status} small />
          </View>
        </View>

        {/* ETA chip */}
        <View style={{ position: "absolute", bottom: 20, alignSelf: "center", backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.green }} />
          <Text style={{ color: C.text, fontWeight: "800", fontSize: 14 }}>Arrivée dans {order.eta}</Text>
        </View>
      </View>

      {/* Bottom Panel */}
      <View style={{ backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 }}>
        {/* Driver */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Text style={{ fontWeight: "900", color: "#fff", fontSize: 20 }}>{order.driver.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 16 }}>{order.driver.name}</Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{order.driver.vehicle}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Icon name="starFilled" size={12} color={C.yellow} />
              <Text style={{ color: C.yellow, fontWeight: "700", fontSize: 12 }}>{order.driver.rating}</Text>
              <Text style={{ color: C.muted, fontSize: 11 }}>· Votre livreur</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${order.driver.phone}`)}
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.primaryLt, borderWidth: 1, borderColor: C.primary + "30", alignItems: "center", justifyContent: "center" }}>
            <Icon name="phone" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View style={{ marginBottom: 16 }}>
          {order.timeline.map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: i < order.timeline.length - 1 ? 12 : 0 }}>
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: step.done ? C.primary : C.bgDeep, borderWidth: 2, borderColor: step.done ? C.primary : C.border, alignItems: "center", justifyContent: "center" }}>
                  {step.done && <Icon name="check" size={12} color="#fff" />}
                </View>
                {i < order.timeline.length - 1 && <View style={{ width: 2, height: 16, backgroundColor: step.done ? C.primary : C.border, marginTop: 2 }} />}
              </View>
              <View style={{ flex: 1, paddingTop: 2, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: step.done ? C.text : C.muted, fontWeight: step.done ? "700" : "400", fontSize: 13 }}>{step.label}</Text>
                <Text style={{ color: C.muted, fontSize: 11 }}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => onNavigate(SCREENS.ORDER_DETAIL)}
          style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 12, alignItems: "center" }}>
          <Text style={{ color: C.primary, fontWeight: "700", fontSize: 14 }}>Voir les détails de la commande</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Order Detail Screen ──────────────────────────────────────────────────────
const OrderDetailScreen = ({ order, onNavigate }) => {
  if (!order) return null;
  const isDelivered = order.status === "Livré";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 22, paddingTop: 52, paddingBottom: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.muted, fontSize: 11 }}>Commande</Text>
            <Text style={{ color: C.text, fontSize: 18, fontWeight: "900" }}>{order.id}</Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22, gap: 12 }} showsVerticalScrollIndicator={false}>
        {/* Items */}
        <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: C.muted, fontSize: 11, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: "600" }}>Articles commandés</Text>
          {order.items.map((item, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: i < order.items.length - 1 ? 10 : 0 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLt, alignItems: "center", justifyContent: "center" }}>
                  <Icon name="package" size={16} color={C.primary} />
                </View>
                <View>
                  <Text style={{ color: C.text, fontWeight: "600", fontSize: 13 }}>{item.name}</Text>
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>Quantité : {item.qty}</Text>
                </View>
              </View>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>{(item.price * item.qty).toLocaleString()} MGA</Text>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: C.border, marginVertical: 12 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: C.muted, fontSize: 13 }}>Frais de livraison</Text>
            <Text style={{ color: C.text, fontSize: 13 }}>{order.deliveryFee.toLocaleString()} MGA</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 15 }}>Total</Text>
            <Text style={{ color: C.primary, fontWeight: "900", fontSize: 16 }}>{(order.total + order.deliveryFee).toLocaleString()} MGA</Text>
          </View>
        </View>

        {/* Address */}
        <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: C.muted, fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: "600" }}>Livraison à</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.accentLt, alignItems: "center", justifyContent: "center" }}>
              <Icon name="location" size={16} color={C.accent} />
            </View>
            <Text style={{ color: C.text, fontSize: 13, fontWeight: "600", flex: 1, lineHeight: 20 }}>{order.address}</Text>
          </View>
        </View>

        {/* Driver */}
        <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: C.muted, fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: "600" }}>Livreur</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: "800", color: "#fff", fontSize: 17 }}>{order.driver.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>{order.driver.name}</Text>
              <Text style={{ color: C.muted, fontSize: 12, marginVertical: 2 }}>{order.driver.vehicle}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <Icon key={s} name={s <= Math.floor(order.driver.rating) ? "starFilled" : "star"} size={11} color={s <= Math.floor(order.driver.rating) ? C.yellow : C.border} />
                ))}
                <Text style={{ color: C.muted, fontSize: 11, marginLeft: 2 }}>{order.driver.rating}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${order.driver.phone}`)}
              style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.primaryLt, borderWidth: 1, borderColor: C.primary + "20", alignItems: "center", justifyContent: "center" }}>
              <Icon name="phone" size={18} color={C.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Row */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "Date", value: order.date },
            { label: "Type", value: order.type === "Express" ? "⚡ Express" : "📦 Standard" },
          ].map(info => (
            <View key={info.label} style={{ flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>{info.label}</Text>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>{info.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action */}
      <View style={{ padding: 22, paddingBottom: 32, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border }}>
        {isDelivered ? (
          <TouchableOpacity onPress={() => onNavigate(SCREENS.RATE)}
            style={{ backgroundColor: C.yellow, borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon name="star" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Évaluer la livraison</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onNavigate(SCREENS.TRACKING)}
            style={{ backgroundColor: C.primary, borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon name="map" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Suivre la livraison</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── History Screen ───────────────────────────────────────────────────────────
const HistoryScreen = ({ onNavigate, onSelectOrder }) => {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "En cours", "Livré", "Annulé"];
  const filtered = filter === "Tous" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 22, paddingTop: 52, paddingBottom: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>Mes commandes</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {filters.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)}
              style={{ backgroundColor: filter === f ? C.primary : C.bg, borderWidth: 1, borderColor: filter === f ? C.primary : C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 }}>
              <Text style={{ color: filter === f ? "#fff" : C.muted, fontWeight: filter === f ? "700" : "400", fontSize: 12 }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false}>
        {filtered.map(order => (
          <TouchableOpacity key={order.id} onPress={() => { onSelectOrder(order); onNavigate(SCREENS.ORDER_DETAIL); }}
            style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ color: C.muted, fontSize: 11 }}>{order.id} · {order.date}</Text>
                <Text style={{ color: C.text, fontSize: 15, fontWeight: "800", marginTop: 3 }} numberOfLines={1}>{order.items.map(i => i.name).join(", ")}</Text>
              </View>
              <StatusBadge status={order.status} small />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Icon name="location" size={13} color={C.muted} />
              <Text style={{ color: C.muted, fontSize: 12, flex: 1 }} numberOfLines={1}>{order.address}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: C.primary, fontWeight: "800", fontSize: 14 }}>{(order.total + order.deliveryFee).toLocaleString()} MGA</Text>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {order.status === "Livré" && (
                  <TouchableOpacity onPress={() => { onSelectOrder(order); onNavigate(SCREENS.RATE); }}
                    style={{ backgroundColor: C.accentLt, borderWidth: 1, borderColor: C.accent + "30", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ color: C.accent, fontWeight: "600", fontSize: 11 }}>⭐ Évaluer</Text>
                  </TouchableOpacity>
                )}
                <View style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 8, width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
                  <Icon name="arrow" size={14} color={C.muted} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ backgroundColor: C.primary, padding: 22, paddingTop: 52, paddingBottom: 30, overflow: "hidden" }}>
        <View style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.05)" }} />
        <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
          style={{ backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Icon name="arrowLeft" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 2, borderColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "900", color: "#fff", fontSize: 28 }}>L</Text>
          </View>
          <View>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.5 }}>Lalaina Rabe</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginVertical: 4 }}>lalaina.rabe@email.mg</Text>
            <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start" }}>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "600" }}>Client Premium</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Card (overlapping) */}
      <View style={{ paddingHorizontal: 22, marginTop: -20, marginBottom: 0 }}>
        <View style={{ backgroundColor: C.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border, flexDirection: "row" }}>
          {[
            { value: "8", label: "Commandes" },
            { value: "6", label: "Livrées" },
            { value: "4.9★", label: "Note moy." },
          ].map((s, i) => (
            <View key={s.label} style={{ flex: 1, alignItems: "center", paddingVertical: 4, borderRightWidth: i < 2 ? 1 : 0, borderRightColor: C.border }}>
              <Text style={{ color: C.primary, fontWeight: "900", fontSize: 20 }}>{s.value}</Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={{ padding: 22, paddingTop: 16 }}>
        {menuSections.map(section => (
          <View key={section.title} style={{ marginBottom: 20 }}>
            <Text style={{ color: C.muted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginLeft: 4 }}>{section.title}</Text>
            <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: "hidden" }}>
              {section.items.map((item, i) => (
                <View key={item.label}>
                  <TouchableOpacity onPress={() => item.screen && onNavigate(item.screen)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 14 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLt, alignItems: "center", justifyContent: "center" }}>
                      <Icon name={item.icon} size={17} color={C.primary} />
                    </View>
                    <Text style={{ color: C.text, fontWeight: "600", fontSize: 14, flex: 1 }}>{item.label}</Text>
                    <Icon name="arrow" size={15} color={C.muted} />
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={{ height: 1, backgroundColor: C.border, marginLeft: 66 }} />}
                </View>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity style={{ backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: 14, padding: 14, alignItems: "center" }}>
          <Text style={{ color: C.red, fontWeight: "700", fontSize: 14 }}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 22, paddingTop: 52, paddingBottom: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: "900", flex: 1 }}>Notifications</Text>
          <View style={{ backgroundColor: C.primaryLt, borderWidth: 1, borderColor: C.primary + "30", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: C.primary, fontSize: 12, fontWeight: "700" }}>2 nouvelles</Text>
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 8 }} showsVerticalScrollIndicator={false}>
        {notifs.map(n => (
          <TouchableOpacity key={n.id}
            style={{ backgroundColor: n.unread ? C.primaryLt : C.card, borderWidth: 1, borderColor: n.unread ? C.primary + "30" : C.border, borderRadius: 14, padding: 12, flexDirection: "row", gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: n.unread ? C.primary + "20" : C.bg, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 20 }}>{n.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ color: C.text, fontWeight: n.unread ? "700" : "500", fontSize: 13, flex: 1 }}>{n.title}</Text>
                {n.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary, marginTop: 3, marginLeft: 8 }} />}
              </View>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{n.desc}</Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>{n.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ─── Confirm Screen ───────────────────────────────────────────────────────────
const ConfirmScreen = ({ onNavigate }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    setTimeout(() => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 12 }).start();
    }, 200);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 30 }}>
      <Animated.View style={{
        width: 120, height: 120, borderRadius: 60, backgroundColor: C.primary,
        alignItems: "center", justifyContent: "center", marginBottom: 28,
        transform: [{ scale: scaleAnim }],
      }}>
        <Icon name="check" size={52} color="#fff" />
      </Animated.View>

      <Text style={{ color: C.text, fontSize: 26, fontWeight: "900", marginBottom: 10, letterSpacing: -0.5, textAlign: "center" }}>Commande confirmée !</Text>
      <Text style={{ color: C.sub, fontSize: 15, marginBottom: 8, textAlign: "center" }}>Votre commande CMD-5513 a été transmise</Text>
      <Text style={{ color: C.muted, fontSize: 13, marginBottom: 36, textAlign: "center" }}>Un livreur vous sera assigné très prochainement. Vous recevrez une notification dès que votre colis sera en route.</Text>

      <View style={{ width: "100%", backgroundColor: C.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 28 }}>
        {[
          { label: "Numéro de commande", value: "CMD-5513" },
          { label: "Type", value: "Standard" },
          { label: "Délai estimé", value: "2–4 heures" },
          { label: "Statut", value: "En attente d'assignation" },
        ].map(info => (
          <View key={info.label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ color: C.muted, fontSize: 13 }}>{info.label}</Text>
            <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>{info.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={() => onNavigate(SCREENS.TRACKING)}
        style={{ width: "100%", backgroundColor: C.primary, borderRadius: 16, padding: 16, alignItems: "center", marginBottom: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Suivre ma commande</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)} style={{ padding: 8 }}>
        <Text style={{ color: C.muted, fontSize: 14 }}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Rate Screen ──────────────────────────────────────────────────────────────
const RateScreen = ({ order, onNavigate }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const tags = ["Rapide", "Soigneux", "Ponctuel", "Bien emballé", "Sympathique", "Professionnel"];
  const [selectedTags, setSelectedTags] = useState([]);
  const toggleTag = tag => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const ratingLabels = ["", "Très déçu 😔", "Décevant 😕", "Correct 😐", "Bien 😊", "Excellent ! 🌟"];

  if (submitted) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 30 }}>
      <Text style={{ fontSize: 80, marginBottom: 20 }}>⭐</Text>
      <Text style={{ color: C.text, fontSize: 24, fontWeight: "900", marginBottom: 10 }}>Merci !</Text>
      <Text style={{ color: C.muted, fontSize: 14, textAlign: "center", marginBottom: 32 }}>Votre évaluation aide notre communauté de livreurs à s'améliorer.</Text>
      <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
        style={{ backgroundColor: C.primary, borderRadius: 14, paddingHorizontal: 40, paddingVertical: 14 }}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ padding: 22, paddingTop: 52, paddingBottom: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}
            style={{ backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrowLeft" size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>Évaluer la livraison</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }} showsVerticalScrollIndicator={false}>
        {/* Driver */}
        {order && (
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: "900", color: "#fff", fontSize: 20 }}>{order.driver.name[0]}</Text>
            </View>
            <View>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 15 }}>{order.driver.name}</Text>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{order.id}</Text>
            </View>
          </View>
        )}

        {/* Stars */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text style={{ color: C.sub, fontSize: 15, fontWeight: "700", marginBottom: 16 }}>Comment s'est passée votre livraison ?</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Svg width={40} height={40} viewBox="0 0 24 24">
                  <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill={rating >= s ? C.yellow : "none"} stroke={rating >= s ? C.yellow : C.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={{ color: C.primary, fontWeight: "700", fontSize: 14, marginTop: 10 }}>{ratingLabels[rating]}</Text>
          )}
        </View>

        {/* Tags */}
        <Text style={{ color: C.sub, fontSize: 13, fontWeight: "700", marginBottom: 12 }}>Ce qui s'est démarqué</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {tags.map(tag => (
            <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}
              style={{ backgroundColor: selectedTags.includes(tag) ? C.primaryLt : C.card, borderWidth: 1.5, borderColor: selectedTags.includes(tag) ? C.primary : C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 }}>
              <Text style={{ color: selectedTags.includes(tag) ? C.primary : C.muted, fontWeight: selectedTags.includes(tag) ? "700" : "400", fontSize: 13 }}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment */}
        <Text style={{ color: C.sub, fontSize: 13, fontWeight: "700", marginBottom: 10 }}>Ajouter un commentaire</Text>
        <TextInput value={comment} onChangeText={setComment} placeholder="Partagez votre expérience..." placeholderTextColor={C.muted}
          multiline numberOfLines={4}
          style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, color: C.text, fontSize: 13, minHeight: 100, textAlignVertical: "top" }} />
      </ScrollView>

      <View style={{ padding: 22, paddingBottom: 32, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border }}>
        <TouchableOpacity onPress={() => rating > 0 && setSubmitted(true)}
          style={{ backgroundColor: rating > 0 ? C.yellow : C.bg, borderWidth: 1, borderColor: rating > 0 ? C.yellow : C.border, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name="star" size={18} color={rating > 0 ? "#fff" : C.muted} />
          <Text style={{ color: rating > 0 ? "#fff" : C.muted, fontWeight: "800", fontSize: 16 }}>Envoyer l'évaluation</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    <View style={{
      flexDirection: "row", backgroundColor: C.card,
      borderTopWidth: 1, borderTopColor: C.border,
      paddingBottom: Platform.OS === "ios" ? 20 : 8,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { height: -4, width: 0 },
    }}>
      {tabs.map(tab => {
        const active = current === tab.id || (current === SCREENS.NOTIFICATIONS && tab.id === SCREENS.HOME);
        const isCenter = tab.id === SCREENS.NEW_ORDER;
        return (
          <TouchableOpacity key={tab.id} onPress={() => onNavigate(tab.id)}
            style={{ flex: 1, alignItems: "center", paddingTop: isCenter ? 0 : 10, paddingBottom: 4, gap: 2, position: "relative" }}>
            {isCenter ? (
              <View style={{
                width: 50, height: 50, borderRadius: 16, backgroundColor: C.primary,
                alignItems: "center", justifyContent: "center", marginTop: -24,
                borderWidth: 3, borderColor: C.white,
              }}>
                <Icon name="plus" size={24} color="#fff" />
              </View>
            ) : (
              <Icon name={tab.icon} size={22} color={active ? C.primary : C.muted} />
            )}
            <Text style={{ color: isCenter ? C.primary : active ? C.primary : C.muted, fontSize: 10, fontWeight: active || isCenter ? "700" : "400" }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function Client() {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={{ flex: 1 }}>
        {renderScreen()}
        <BottomNav current={screen} onNavigate={setScreen} />
      </View>
    </SafeAreaView>
  );
}