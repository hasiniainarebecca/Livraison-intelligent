import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "../../components/livreur/Icon";
import StatusBadge from "../../components/livreur/StatusBadge";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";
import { deliveries } from "../../data/livreur/deliveries";

const FILTERS = ["Tous", "Livré", "En cours", "En attente", "Annulé"];

const HistoryScreen = ({ onNavigate, onSelectDelivery }) => {
  const [filter, setFilter] = useState("Tous");

  const filtered =
    filter === "Tous"
      ? deliveries
      : deliveries.filter((d) => d.status === filter);

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
          <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: "800" }}>
            Historique
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
                backgroundColor: filter === f ? COLORS.accent : COLORS.card,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: filter === f ? COLORS.accent : COLORS.border,
              }}
            >
              <Text
                style={{
                  color: filter === f ? "#fff" : COLORS.muted,
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
        {filtered.map((d) => (
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
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <View>
                <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                  {d.id} · {d.time}
                </Text>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 15,
                    fontWeight: "700",
                    marginTop: 3,
                  }}
                >
                  {d.client}
                </Text>
              </View>
              <StatusBadge status={d.status} small />
            </View>

            <Text
              style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}
            >
              {d.address}
            </Text>

            <View
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                📦 {d.items} articles
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                ⚖️ {d.weight}
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
              <View style={{ flex: 1 }} />
              <Icon name="arrow" size={14} color={COLORS.muted} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
