import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/livreur/Icon";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";

const NOTIFICATIONS = [
  {
    id: 1,
    icon: "📦",
    title: "Nouvelle commande assignée",
    desc: "LIV-2848 · Fanja Rasolofo · Isoraka",
    time: "Il y a 5 min",
    unread: true,
  },
  {
    id: 2,
    icon: "⚡",
    title: "Livraison express prioritaire",
    desc: "LIV-2847 en attente de démarrage",
    time: "Il y a 12 min",
    unread: true,
  },
  {
    id: 3,
    icon: "✅",
    title: "Livraison confirmée",
    desc: "LIV-2843 · Hery Raharison livré avec succès",
    time: "Il y a 1h",
    unread: false,
  },
  {
    id: 4,
    icon: "⭐",
    title: "Nouvelle évaluation reçue",
    desc: "Hery Raharison vous a donné 5/5",
    time: "Il y a 1h",
    unread: false,
  },
  {
    id: 5,
    icon: "💰",
    title: "Paiement reçu",
    desc: "45 000 MGA crédité sur votre compte",
    time: "Il y a 2h",
    unread: false,
  },
  {
    id: 6,
    icon: "🗺️",
    title: "Itinéraire optimisé",
    desc: "Nouveau trajet suggéré pour 3 livraisons",
    time: "Il y a 3h",
    unread: false,
  },
];

const NotificationsScreen = ({ onNavigate }) => {
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* ── Header ── */}
      <View
        style={{
          padding: 20,
          paddingTop: 52,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 10,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Icon name="arrowLeft" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 20,
              fontWeight: "800",
              flex: 1,
            }}
          >
            Notifications
          </Text>
          <View
            style={{
              backgroundColor: COLORS.accent + "20",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderWidth: 1,
              borderColor: COLORS.accent + "40",
            }}
          >
            <Text
              style={{ color: COLORS.accent, fontSize: 12, fontWeight: "700" }}
            >
              {unreadCount} nouvelles
            </Text>
          </View>
        </View>
      </View>

      {/* ── List ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={{
              backgroundColor: n.unread ? COLORS.card : "transparent",
              borderRadius: 14,
              padding: 12,
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              borderWidth: 1,
              borderColor: n.unread ? COLORS.accent + "20" : "transparent",
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: COLORS.cardLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>{n.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: n.unread ? "700" : "500",
                    fontSize: 13,
                    flex: 1,
                  }}
                >
                  {n.title}
                </Text>
                {n.unread && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: COLORS.accent,
                      marginTop: 3,
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>
                {n.desc}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 4 }}>
                {n.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
