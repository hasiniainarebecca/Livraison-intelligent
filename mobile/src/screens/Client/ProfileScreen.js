import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/client/Icon";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const MENU_SECTIONS = [
  {
    title: "Mon compte",
    items: [
      { icon: "edit", label: "Modifier le profil" },
      { icon: "location", label: "Mes adresses" },
      { icon: "wallet", label: "Paiements & Portefeuille" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "bell", label: "Notifications", screen: SCREENS.NOTIFICATIONS },
      { icon: "shield", label: "Sécurité & Confidentialité" },
      { icon: "help", label: "Aide & Support" },
      { icon: "settings", label: "Paramètres" },
    ],
  },
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
          backgroundColor: C.primary,
          paddingTop: 52,
          paddingHorizontal: 22,
          paddingBottom: 30,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />

        <View style={{ alignSelf: "flex-start", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="arrowLeft" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.25)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 28 }}>
              L
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "900",
                letterSpacing: -0.5,
              }}
            >
              Lalaina Rabe
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                marginTop: 4,
                marginBottom: 8,
              }}
            >
              lalaina.rabe@email.mg
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
                borderRadius: 10,
                paddingVertical: 3,
                paddingHorizontal: 10,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                Client Premium
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Stats card (overlapping header) ── */}
      <View style={{ paddingHorizontal: 22, marginTop: -20 }}>
        <View
          style={{
            backgroundColor: C.card,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: C.border,
            flexDirection: "row",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          {[
            { value: "8", label: "Commandes" },
            { value: "6", label: "Livrées" },
            { value: "4.9★", label: "Note moy." },
          ].map((s, i) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRightWidth: i < 2 ? 1 : 0,
                borderRightColor: C.border,
              }}
            >
              <Text
                style={{ color: C.primary, fontWeight: "900", fontSize: 20 }}
              >
                {s.value}
              </Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Menu ── */}
      <View style={{ padding: 22, paddingTop: 20 }}>
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: C.muted,
                fontSize: 11,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 10,
                marginLeft: 4,
              }}
            >
              {section.title}
            </Text>
            <View
              style={{
                backgroundColor: C.card,
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              {section.items.map((item, i) => (
                <View key={item.label}>
                  <TouchableOpacity
                    onPress={() => item.screen && onNavigate(item.screen)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      padding: 14,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: C.primaryLt,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name={item.icon} size={17} color={C.primary} />
                    </View>
                    <Text
                      style={{
                        color: C.text,
                        fontWeight: "600",
                        fontSize: 14,
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Icon name="arrow" size={15} color={C.muted} />
                  </TouchableOpacity>
                  {i < section.items.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: C.border,
                        marginLeft: 66,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={{
            backgroundColor: "#FEF2F2",
            borderWidth: 1,
            borderColor: "#FECACA",
            borderRadius: 14,
            padding: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: C.red, fontWeight: "700", fontSize: 14 }}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
