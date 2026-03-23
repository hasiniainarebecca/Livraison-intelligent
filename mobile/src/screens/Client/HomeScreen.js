import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/client/Icon";
import StatusBadge from "../../components/client/StatusBadge";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";
import { ORDERS } from "../../data/client/orders";

const HomeScreen = ({ onNavigate, onSelectOrder }) => {
  const active = ORDERS.filter((o) => o.status === "En cours");
  const recent = ORDERS.filter((o) => o.status === "Livré").slice(0, 2);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ── */}
      <View
        style={{
          backgroundColor: C.primary,
          paddingTop: 52,
          paddingHorizontal: 22,
          paddingBottom: 28,
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <View
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 22,
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                letterSpacing: 1.2,
              }}
            >
              BONJOUR 👋
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "900",
                marginTop: 4,
                letterSpacing: -0.5,
              }}
            >
              Lalaina Rabe
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.NOTIFICATIONS)}
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="bell" size={18} color="#fff" />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: C.accent,
                  borderWidth: 2,
                  borderColor: C.primary,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.PROFILE)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                L
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New Order Button */}
        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.NEW_ORDER)}
          style={{
            backgroundColor: C.accent,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            shadowColor: C.accent,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="plus" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
              Nouvelle commande
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Express ou standard, livraison rapide
            </Text>
          </View>
          <Icon name="arrow" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* ── Quick Stats ── */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { emoji: "📦", value: "8", label: "Commandes" },
            { emoji: "✅", value: "6", label: "Livrées" },
            { emoji: "⭐", value: "4.9", label: "Ma note" },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: C.card,
                borderRadius: 16,
                padding: 14,
                alignItems: "center",
                borderWidth: 1,
                borderColor: C.border,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
              <Text
                style={{
                  color: C.text,
                  fontWeight: "900",
                  fontSize: 20,
                  marginTop: 6,
                }}
              >
                {s.value}
              </Text>
              <Text style={{ color: C.muted, fontSize: 10 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Active Order ── */}
      {active.length > 0 && (
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text
            style={{
              color: C.text,
              fontSize: 15,
              fontWeight: "800",
              marginBottom: 12,
            }}
          >
            🚚 Commande en cours
          </Text>
          {active.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => {
                onSelectOrder(order);
                onNavigate(SCREENS.TRACKING);
              }}
              style={{
                backgroundColor: C.primaryLt + "80",
                borderWidth: 1.5,
                borderColor: C.primary + "30",
                borderRadius: 20,
                padding: 18,
                shadowColor: C.primary,
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <View>
                  <Text style={{ color: C.muted, fontSize: 11 }}>
                    {order.id}
                  </Text>
                  <Text
                    style={{
                      color: C.text,
                      fontSize: 17,
                      fontWeight: "800",
                      marginTop: 3,
                    }}
                  >
                    {order.items.map((i) => i.name).join(", ")}
                  </Text>
                </View>
                <StatusBadge status={order.status} />
              </View>

              {/* Progress bar */}
              <View style={{ marginBottom: 14 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: C.sub, fontSize: 12 }}>
                    Progression
                  </Text>
                  <Text
                    style={{
                      color: C.primary,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {order.progress}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: C.bgDeep,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${order.progress}%`,
                      backgroundColor: C.primary,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: C.white,
                    borderRadius: 12,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  <Text
                    style={{
                      color: C.primary,
                      fontWeight: "900",
                      fontSize: 18,
                    }}
                  >
                    {order.eta}
                  </Text>
                  <Text style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>
                    Arrivée estimée
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    onSelectOrder(order);
                    onNavigate(SCREENS.TRACKING);
                  }}
                  style={{
                    flex: 2,
                    backgroundColor: C.primary,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="map" size={15} color="#fff" />
                  <Text
                    style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}
                  >
                    Suivre en direct
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Recent Orders ── */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: C.text, fontSize: 15, fontWeight: "800" }}>
            Commandes récentes
          </Text>
          <TouchableOpacity onPress={() => onNavigate(SCREENS.HISTORY)}>
            <Text style={{ color: C.primary, fontSize: 12, fontWeight: "700" }}>
              Tout voir
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10 }}>
          {recent.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => {
                onSelectOrder(order);
                onNavigate(SCREENS.ORDER_DETAIL);
              }}
              style={{
                backgroundColor: C.card,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 16,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  backgroundColor: C.primaryLt,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="package" size={22} color={C.primary} />
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
                    style={{ color: C.text, fontWeight: "700", fontSize: 14 }}
                  >
                    {order.id}
                  </Text>
                  <StatusBadge status={order.status} small />
                </View>
                <Text
                  style={{ color: C.muted, fontSize: 12, marginTop: 3 }}
                  numberOfLines={1}
                >
                  {order.items.map((i) => i.name).join(", ")}
                </Text>
                <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                  {order.date}
                </Text>
              </View>
              <Icon name="arrow" size={16} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Promo Banner ── */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View
          style={{
            backgroundColor: C.accent,
            borderRadius: 20,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: C.accent,
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Offre spéciale
            </Text>
            <Text
              style={{
                color: "#fff",
                fontWeight: "900",
                fontSize: 16,
                marginVertical: 4,
              }}
            >
              Livraison gratuite
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              Pour toute commande {">"} 50 000 MGA
            </Text>
          </View>
          <Text style={{ fontSize: 48 }}>🎁</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
