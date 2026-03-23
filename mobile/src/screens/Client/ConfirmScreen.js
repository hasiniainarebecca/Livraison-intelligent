import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Icon from "../../components/client/Icon";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const INFO_ROWS = [
  { label: "Numéro de commande", value: "CMD-5513" },
  { label: "Type", value: "Standard" },
  { label: "Délai estimé", value: "2–4 heures" },
  { label: "Statut", value: "En attente d'assignation" },
];

const ConfirmScreen = ({ onNavigate }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: 100,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.bg,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
      }}
    >
      {/* Animated check circle */}
      <Animated.View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: C.primary,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
          elevation: 12,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Icon name="check" size={52} color="#fff" />
      </Animated.View>

      <Text
        style={{
          color: C.text,
          fontSize: 26,
          fontWeight: "900",
          letterSpacing: -0.5,
          textAlign: "center",
        }}
      >
        Commande confirmée !
      </Text>
      <Text
        style={{
          color: C.sub,
          fontSize: 15,
          textAlign: "center",
          marginTop: 10,
          marginBottom: 8,
        }}
      >
        Votre commande CMD-5513 a été transmise
      </Text>
      <Text
        style={{
          color: C.muted,
          fontSize: 13,
          textAlign: "center",
          marginBottom: 36,
          lineHeight: 20,
        }}
      >
        Un livreur vous sera assigné très prochainement.{"\n"}
        Vous recevrez une notification dès que votre colis est en route.
      </Text>

      {/* Info card */}
      <View
        style={{
          width: "100%",
          backgroundColor: C.card,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: C.border,
          marginBottom: 28,
        }}
      >
        {INFO_ROWS.map((info, i) => (
          <View
            key={info.label}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: i < INFO_ROWS.length - 1 ? 10 : 0,
            }}
          >
            <Text style={{ color: C.muted, fontSize: 13 }}>{info.label}</Text>
            <Text style={{ color: C.text, fontWeight: "700", fontSize: 13 }}>
              {info.value}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => onNavigate(SCREENS.TRACKING)}
        style={{
          width: "100%",
          backgroundColor: C.primary,
          borderRadius: 16,
          padding: 16,
          alignItems: "center",
          marginBottom: 12,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
          Suivre ma commande
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate(SCREENS.HOME)}>
        <Text style={{ color: C.muted, fontSize: 14, padding: 8 }}>
          Retour à l'accueil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmScreen;
