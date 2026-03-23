import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/client/Icon";
import StatusBadge from "../../components/client/StatusBadge";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";
import { ORDERS } from "../../data/client/orders";

const FILTERS = ["Tous", "En cours", "Livré", "Annulé"];

const HistoryScreen = ({ onNavigate, onSelectOrder }) => {
  const [filter, setFilter] = useState("Tous");

  const filtered =
    filter === "Tous" ? ORDERS : ORDERS.filter((o) => o.status === filter);

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
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
          <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>
            Mes commandes
          </Text>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                backgroundColor: filter === f ? C.primary : C.bg,
                borderWidth: 1,
                borderColor: filter === f ? C.primary : C.border,
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color: filter === f ? "#fff" : C.muted,
                  fontWeight: filter === f ? "700" : "400",
                  fontSize: 12,
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── List ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((order) => (
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
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <View>
                <Text style={{ color: C.muted, fontSize: 11 }}>
                  {order.id} · {order.date}
                </Text>
                <Text
                  style={{
                    color: C.text,
                    fontSize: 15,
                    fontWeight: "800",
                    marginTop: 3,
                  }}
                >
                  {order.items.map((i) => i.name).join(", ")}
                </Text>
              </View>
              <StatusBadge status={order.status} small />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Icon name="location" size={13} color={C.muted} />
              <Text
                style={{ color: C.muted, fontSize: 12, flex: 1 }}
                numberOfLines={1}
              >
                {order.address}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: C.primary, fontWeight: "800", fontSize: 14 }}
              >
                {(order.total + order.deliveryFee).toLocaleString()} MGA
              </Text>
              <View
                style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
              >
                {order.status === "Livré" && (
                  <TouchableOpacity
                    onPress={(e) => {
                      onSelectOrder(order);
                      onNavigate(SCREENS.RATE);
                    }}
                    style={{
                      backgroundColor: C.accentLt,
                      borderWidth: 1,
                      borderColor: C.accent + "30",
                      borderRadius: 8,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: C.accent,
                        fontWeight: "600",
                        fontSize: 11,
                      }}
                    >
                      ⭐ Évaluer
                    </Text>
                  </TouchableOpacity>
                )}
                <View
                  style={{
                    backgroundColor: C.bg,
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 8,
                    width: 28,
                    height: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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

export default HistoryScreen;
