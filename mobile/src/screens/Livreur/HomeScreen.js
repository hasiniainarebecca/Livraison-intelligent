import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/livreur/Icon";
import StatusBadge from "../../components/livreur/StatusBadge";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";
import { deliveries } from "../../data/livreur/deliveries";

const HomeScreen = ({ onNavigate, onSelectDelivery }) => {
  const [isOnline, setIsOnline] = useState(true);

  const active = deliveries.filter((d) => d.status === "En cours");
  const pending = deliveries.filter((d) => d.status === "En attente");
  const done = deliveries.filter((d) => d.status === "Livré");

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={{ padding: 20, paddingTop: 52, backgroundColor: "#0D1525" }}>
        <View
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: COLORS.accent + "08",
            borderWidth: 1,
            borderColor: COLORS.accent + "15",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View>
            <Text
              style={{
                color: COLORS.muted,
                fontSize: 12,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Bonjour 👋
            </Text>
            <Text
              style={{
                color: COLORS.text,
                fontSize: 22,
                fontWeight: "800",
                marginTop: 4,
                letterSpacing: -0.5,
              }}
            >
              Toky Randria
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.NOTIFICATIONS)}
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 12,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Icon name="bell" size={18} color={COLORS.text} />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.accent,
                  borderWidth: 2,
                  borderColor: COLORS.card,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.PROFILE)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: COLORS.accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
                T
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Online Toggle */}
        <View
          style={{
            marginTop: 20,
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: isOnline ? COLORS.green + "40" : COLORS.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: isOnline ? COLORS.green : COLORS.muted,
              }}
            />
            <View>
              <Text
                style={{ color: COLORS.text, fontWeight: "700", fontSize: 14 }}
              >
                {isOnline ? "En ligne" : "Hors ligne"}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                {isOnline
                  ? "Disponible pour les livraisons"
                  : "Vous ne recevrez pas de commandes"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsOnline(!isOnline)}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              backgroundColor: isOnline ? COLORS.green : COLORS.border,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                left: isOnline ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Stats ── */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            {
              label: "Aujourd'hui",
              value: done.length + active.length,
              unit: "livraisons",
              icon: "truck",
              color: COLORS.teal,
            },
            {
              label: "Revenus",
              value: "48 500",
              unit: "MGA",
              icon: "wallet",
              color: COLORS.accent,
            },
            {
              label: "Note",
              value: "4.8",
              unit: "/ 5",
              icon: "star",
              color: COLORS.yellow,
            },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: 16,
                padding: 14,
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Icon name={stat.icon} size={20} color={stat.color} />
              <Text
                style={{
                  color: COLORS.text,
                  fontWeight: "800",
                  fontSize: 18,
                  marginTop: 8,
                }}
              >
                {stat.value}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 10 }}>
                {stat.unit}
              </Text>
              <Text
                style={{ color: COLORS.muted, fontSize: 9, letterSpacing: 0.5 }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Active Delivery ── */}
      {active.length > 0 && (
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 15,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            🚀 Livraison en cours
          </Text>
          {active.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => {
                onSelectDelivery(d);
                onNavigate(SCREENS.DELIVERY_DETAIL);
              }}
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: "#38BDF840",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <View>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                    {d.id}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 16,
                      fontWeight: "700",
                      marginTop: 2,
                    }}
                  >
                    {d.client}
                  </Text>
                </View>
                <StatusBadge status={d.status} />
              </View>

              <View
                style={{
                  backgroundColor: COLORS.cardLight,
                  borderRadius: 12,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Icon name="location" size={16} color={COLORS.accent} />
                <Text style={{ color: COLORS.text, fontSize: 13, flex: 1 }}>
                  {d.address}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.cardLight,
                    borderRadius: 10,
                    padding: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.accent,
                      fontWeight: "800",
                      fontSize: 16,
                    }}
                  >
                    {d.eta}
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 10 }}>ETA</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.cardLight,
                    borderRadius: 10,
                    padding: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.text,
                      fontWeight: "800",
                      fontSize: 16,
                    }}
                  >
                    {d.distance}
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 10 }}>
                    Distance
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onNavigate(SCREENS.MAP)}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.accent,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Icon name="navigation" size={14} color="#fff" />
                  <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}
                  >
                    Naviguer
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Pending Deliveries ── */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "700" }}>
            📦 En attente ({pending.length})
          </Text>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HISTORY)}>
            <Text
              style={{ color: COLORS.accent, fontSize: 12, fontWeight: "600" }}
            >
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10 }}>
          {pending.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => {
                onSelectDelivery(d);
                onNavigate(SCREENS.DELIVERY_DETAIL);
              }}
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 16,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: COLORS.cardLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="package" size={20} color={COLORS.muted} />
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.text,
                      fontWeight: "700",
                      fontSize: 14,
                    }}
                  >
                    {d.client}
                  </Text>
                  <StatusBadge status={d.status} small />
                </View>
                <Text
                  style={{ color: COLORS.muted, fontSize: 11, marginTop: 3 }}
                  numberOfLines={1}
                >
                  {d.address}
                </Text>
                <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                    📍 {d.distance}
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                    ⏱ {d.eta}
                  </Text>
                  {d.type === "Express" && (
                    <Text
                      style={{
                        color: COLORS.accent,
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                    >
                      ⚡ Express
                    </Text>
                  )}
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

export default HomeScreen;
