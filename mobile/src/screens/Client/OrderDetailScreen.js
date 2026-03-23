import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "../../components/client/Icon";
import StatusBadge from "../../components/client/StatusBadge";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const OrderDetailScreen = ({ order, onNavigate }) => {
  if (!order) return null;
  const isDelivered = order.status === "Livré";

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
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.muted, fontSize: 11 }}>Commande</Text>
            <Text style={{ color: C.text, fontSize: 18, fontWeight: "900" }}>
              {order.id}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Items + Total */}
        <View
          style={{
            backgroundColor: C.card,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: C.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: "600",
              marginBottom: 12,
            }}
          >
            Articles commandés
          </Text>
          {order.items.map((item, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: i < order.items.length - 1 ? 10 : 0,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
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
                  <Icon name="package" size={16} color={C.primary} />
                </View>
                <View>
                  <Text
                    style={{ color: C.text, fontWeight: "600", fontSize: 13 }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>
                    Quantité : {item.qty}
                  </Text>
                </View>
              </View>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>
                {(item.price * item.qty).toLocaleString()} MGA
              </Text>
            </View>
          ))}

          <View
            style={{ height: 1, backgroundColor: C.border, marginVertical: 12 }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: C.muted, fontSize: 13 }}>
              Frais de livraison
            </Text>
            <Text style={{ color: C.text, fontSize: 13 }}>
              {order.deliveryFee.toLocaleString()} MGA
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 15 }}>
              Total
            </Text>
            <Text style={{ color: C.primary, fontWeight: "900", fontSize: 16 }}>
              {(order.total + order.deliveryFee).toLocaleString()} MGA
            </Text>
          </View>
        </View>

        {/* Address */}
        <View
          style={{
            backgroundColor: C.card,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: C.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            Livraison à
          </Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: C.accentLt,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="location" size={16} color={C.accent} />
            </View>
            <Text
              style={{
                color: C.text,
                fontSize: 13,
                fontWeight: "600",
                flex: 1,
                lineHeight: 20,
              }}
            >
              {order.address}
            </Text>
          </View>
        </View>

        {/* Driver */}
        <View
          style={{
            backgroundColor: C.card,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: C.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            Livreur
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                backgroundColor: C.primary,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>
                {order.driver.name[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>
                {order.driver.name}
              </Text>
              <Text style={{ color: C.muted, fontSize: 12, marginVertical: 2 }}>
                {order.driver.vehicle}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon
                    key={s}
                    name="star"
                    size={11}
                    color={
                      s <= Math.floor(order.driver.rating) ? C.yellow : C.border
                    }
                  />
                ))}
                <Text style={{ color: C.muted, fontSize: 11, marginLeft: 2 }}>
                  {order.driver.rating}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${order.driver.phone}`)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: C.primaryLt,
                borderWidth: 1,
                borderColor: C.primary + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="phone" size={18} color={C.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info row */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "Date", value: order.date },
            {
              label: "Type",
              value: order.type === "Express" ? "⚡ Express" : "📦 Standard",
            },
          ].map((info) => (
            <View
              key={info.label}
              style={{
                flex: 1,
                backgroundColor: C.card,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <Text style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>
                {info.label}
              </Text>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>
                {info.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Action ── */}
      <View
        style={{
          paddingHorizontal: 22,
          paddingVertical: 12,
          paddingBottom: 28,
          backgroundColor: C.card,
          borderTopWidth: 1,
          borderTopColor: C.border,
        }}
      >
        {isDelivered ? (
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.RATE)}
            style={{
              backgroundColor: C.yellow,
              borderRadius: 14,
              padding: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              shadowColor: C.yellow,
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Icon name="star" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
              Évaluer la livraison
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.TRACKING)}
            style={{
              backgroundColor: C.primary,
              borderRadius: 14,
              padding: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              shadowColor: C.primary,
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Icon name="map" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
              Suivre la livraison
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OrderDetailScreen;
