import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/livreur/Icon";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";

const STATS = [
  { label: "Total livraisons", value: "1 248" },
  { label: "Taux de réussite", value: "98.4%" },
  { label: "Note moyenne", value: "4.8 ★" },
  { label: "Revenus ce mois", value: "245 000 MGA" },
];

const MENU_ITEMS = [
  { icon: "bell", label: "Notifications", screen: SCREENS.NOTIFICATIONS },
  { icon: "history", label: "Historique", screen: SCREENS.HISTORY },
  { icon: "wallet", label: "Revenus & Paiements", screen: null },
  { icon: "settings", label: "Paramètres", screen: null },
];

const ProfileScreen = ({ onNavigate }) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View
        style={{
          backgroundColor: "#0D1525",
          padding: 20,
          paddingTop: 52,
          alignItems: "center",
        }}
      >
        <View style={{ alignSelf: "flex-start", marginBottom: 16 }}>
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
        </View>

        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 28,
            backgroundColor: COLORS.accent,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 36 }}>
            T
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.text,
            fontSize: 22,
            fontWeight: "800",
            marginBottom: 4,
          }}
        >
          Toky Randria
        </Text>
        <Text style={{ color: COLORS.muted, fontSize: 13, marginBottom: 4 }}>
          Livreur · ID: DRV-00142
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.green,
            }}
          />
          <Text
            style={{ color: COLORS.green, fontSize: 12, fontWeight: "600" }}
          >
            En ligne
          </Text>
        </View>
      </View>

      {/* ── Stats ── */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {STATS.map((s) => (
            <View
              key={s.label}
              style={{
                width: "47%",
                backgroundColor: COLORS.card,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text
                style={{ color: COLORS.text, fontWeight: "800", fontSize: 18 }}
              >
                {s.value}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Menu ── */}
      <View style={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          {MENU_ITEMS.map((item, i) => (
            <View key={item.label}>
              <TouchableOpacity
                onPress={() => item.screen && onNavigate(item.screen)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: 16,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: COLORS.cardLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={item.icon} size={18} color={COLORS.muted} />
                </View>
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: "600",
                    fontSize: 14,
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
                <Icon name="arrow" size={16} color={COLORS.muted} />
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.border,
                    marginLeft: 68,
                  }}
                />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: "#1C0A0A",
            borderRadius: 14,
            padding: 14,
            alignItems: "center",
            borderWidth: 1,
            borderColor: COLORS.red + "30",
          }}
        >
          <Text style={{ color: COLORS.red, fontWeight: "700", fontSize: 14 }}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
