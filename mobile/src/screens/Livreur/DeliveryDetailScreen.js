import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "../../components/livreur/Icon";
import StatusBadge from "../../components/livreur/StatusBadge";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";

const STAGES = ["En attente", "En cours", "Livré"];

const DeliveryDetailScreen = ({ delivery, onNavigate }) => {
  const [status, setStatus] = useState(delivery?.status || "En attente");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!delivery) return null;

  const currentIdx = STAGES.indexOf(status);

  const handleAction = () => {
    if (status === "Livré") return;
    if (status === "En cours") setShowConfirm(true);
    else setStatus("En cours");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* ── Header ── */}
      <View
        style={{
          padding: 20,
          paddingTop: 52,
          backgroundColor: COLORS.card,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.cardLight,
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
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.muted, fontSize: 11 }}>Livraison</Text>
            <Text
              style={{ color: COLORS.text, fontSize: 18, fontWeight: "800" }}
            >
              {delivery.id}
            </Text>
          </View>
          <StatusBadge status={status} />
        </View>

        {/* Progress Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {STAGES.map((s, i) => (
            <View
              key={s}
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor:
                    i <= currentIdx ? COLORS.accent : COLORS.border,
                }}
              />
              {i < 2 && <View style={{ width: 4 }} />}
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          {STAGES.map((s) => (
            <Text
              key={s}
              style={{
                color: status === s ? COLORS.accent : COLORS.muted,
                fontSize: 9,
                fontWeight: status === s ? "700" : "400",
              }}
            >
              {s}
            </Text>
          ))}
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Client */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Text
            style={{
              color: COLORS.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Client
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: COLORS.teal + "40",
                borderWidth: 1,
                borderColor: COLORS.teal + "40",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: COLORS.teal, fontWeight: "800", fontSize: 18 }}
              >
                {delivery.client[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: COLORS.text, fontWeight: "700", fontSize: 16 }}
              >
                {delivery.client}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                {delivery.phone}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${delivery.phone}`)}
              style={{
                backgroundColor: COLORS.green + "20",
                borderRadius: 10,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: COLORS.green + "40",
              }}
            >
              <Icon name="phone" size={18} color={COLORS.green} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Text
            style={{
              color: COLORS.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Adresse de livraison
          </Text>
          <View
            style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: COLORS.accent + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="location" size={18} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: COLORS.text, fontSize: 14, fontWeight: "600" }}
              >
                {delivery.address}
              </Text>
              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>
                  📍 {delivery.distance}
                </Text>
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>
                  ⏱ ETA: {delivery.eta}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.MAP)}
            style={{
              marginTop: 12,
              backgroundColor: COLORS.cardLight,
              borderRadius: 10,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderWidth: 1,
              borderColor: COLORS.accent + "30",
            }}
          >
            <Icon name="navigation" size={15} color={COLORS.accent} />
            <Text
              style={{ color: COLORS.accent, fontWeight: "700", fontSize: 13 }}
            >
              Ouvrir la navigation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Package */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Text
            style={{
              color: COLORS.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Colis
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { label: "Articles", value: delivery.items },
              { label: "Poids", value: delivery.weight },
              { label: "Type", value: delivery.type },
            ].map((info) => (
              <View
                key={info.label}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.cardLight,
                  borderRadius: 10,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: "700",
                    fontSize: 15,
                  }}
                >
                  {info.value}
                </Text>
                <Text
                  style={{ color: COLORS.muted, fontSize: 10, marginTop: 2 }}
                >
                  {info.label}
                </Text>
              </View>
            ))}
          </View>
          {!!delivery.note && (
            <View
              style={{
                backgroundColor: "#1A1500",
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
                flexDirection: "row",
                gap: 8,
                borderWidth: 1,
                borderColor: COLORS.yellow + "30",
              }}
            >
              <Text style={{ fontSize: 14 }}>📝</Text>
              <Text style={{ color: COLORS.yellow, fontSize: 12 }}>
                {delivery.note}
              </Text>
            </View>
          )}
        </View>

        {/* Scanner */}
        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.SCANNER)}
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Icon name="scan" size={18} color={COLORS.muted} />
          <Text style={{ color: COLORS.text, fontWeight: "600", fontSize: 14 }}>
            Scanner le code de confirmation
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Action Button ── */}
      <View
        style={{
          padding: 20,
          paddingBottom: 32,
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        {status !== "Livré" ? (
          <TouchableOpacity
            onPress={handleAction}
            style={{
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
              backgroundColor:
                status === "En cours" ? COLORS.green : COLORS.accent,
            }}
          >
            <Icon
              name={status === "En cours" ? "check" : "truck"}
              size={20}
              color="#fff"
            />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              {status === "En cours"
                ? "Confirmer la livraison"
                : "Démarrer la livraison"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ alignItems: "center", padding: 16 }}>
            <Text style={{ fontSize: 32, marginBottom: 4 }}>✅</Text>
            <Text
              style={{ color: COLORS.green, fontWeight: "700", fontSize: 16 }}
            >
              Livraison confirmée !
            </Text>
          </View>
        )}
      </View>

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 24,
              padding: 24,
              paddingBottom: 40,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>📦</Text>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 18,
                  fontWeight: "800",
                  marginBottom: 8,
                }}
              >
                Confirmer la livraison ?
              </Text>
              <Text
                style={{
                  color: COLORS.muted,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Cette action est irréversible. Le client sera notifié.
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.cardLight,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: "700",
                    fontSize: 15,
                  }}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setStatus("Livré");
                  setShowConfirm(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.green,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}
                >
                  ✓ Confirmer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DeliveryDetailScreen;
