import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/client/Icon";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const NOTIFICATIONS = [
  {
    id: 1,
    emoji: "🚚",
    title: "Votre livreur est en route",
    desc: "CMD-5512 · Toky Randria démarre la livraison",
    time: "Il y a 2 min",
    unread: true,
  },
  {
    id: 2,
    emoji: "✅",
    title: "Commande confirmée",
    desc: "CMD-5512 a été validée et assignée",
    time: "Il y a 15 min",
    unread: true,
  },
  {
    id: 3,
    emoji: "📦",
    title: "Nouvelle commande créée",
    desc: "CMD-5512 · Express · Analamahitsy",
    time: "Il y a 20 min",
    unread: false,
  },
  {
    id: 4,
    emoji: "⭐",
    title: "Merci pour votre évaluation",
    desc: "Vous avez noté CMD-5498 : 5 étoiles",
    time: "Hier, 12:30",
    unread: false,
  },
  {
    id: 5,
    emoji: "🎁",
    title: "Offre spéciale disponible",
    desc: "Livraison gratuite ce weekend sur toutes vos commandes",
    time: "Hier, 09:00",
    unread: false,
  },
  {
    id: 6,
    emoji: "✅",
    title: "Livraison confirmée",
    desc: "CMD-5498 a bien été livrée",
    time: "Hier, 11:50",
    unread: false,
  },
];

const NotificationsScreen = ({ onNavigate }) => {
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* ── Header ── */}
      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 22,
          paddingBottom: 16,
          backgroundColor: C.card,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: C.bg,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 10,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="arrowLeft" size={18} color={C.text} />
          </TouchableOpacity>
          <Text
            style={{ color: C.text, fontSize: 20, fontWeight: "900", flex: 1 }}
          >
            Notifications
          </Text>
          <View
            style={{
              backgroundColor: C.primaryLt,
              borderWidth: 1,
              borderColor: C.primary + "30",
              borderRadius: 10,
              paddingVertical: 3,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: C.primary, fontSize: 12, fontWeight: "700" }}>
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
              backgroundColor: n.unread ? C.primaryLt : C.card,
              borderWidth: 1,
              borderColor: n.unread ? C.primary + "30" : C.border,
              borderRadius: 14,
              padding: 12,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: n.unread ? C.primary + "20" : C.bg,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: 20 }}>{n.emoji}</Text>
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
                    color: C.text,
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
                      backgroundColor: C.primary,
                      flexShrink: 0,
                      marginTop: 3,
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                {n.desc}
              </Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>
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
