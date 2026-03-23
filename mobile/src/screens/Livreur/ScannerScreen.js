import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Icon from "../../components/livreur/Icon";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";

const CORNERS = [
  { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
];

const ScannerScreen = ({ onNavigate }) => {
  const [scanned, setScanned] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [scanned]);

  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center" }}>
      {/* ── Header ── */}
      <View
        style={{
          width: "100%",
          padding: 20,
          paddingTop: 52,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.HOME)}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 10,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="arrowLeft" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
          Scanner le colis
        </Text>
      </View>

      {/* ── Viewfinder ── */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: 20,
        }}
      >
        <View style={{ position: "relative", width: 260, height: 260 }}>
          {/* Camera view mock */}
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              backgroundColor: "#0D2030",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {!scanned && (
              <Animated.View
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  height: 2,
                  backgroundColor: COLORS.accent,
                  transform: [{ translateY: scanLineTranslate }],
                }}
              />
            )}

            {scanned ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 60, marginBottom: 12 }}>✅</Text>
                <Text
                  style={{
                    color: COLORS.green,
                    fontWeight: "800",
                    fontSize: 18,
                  }}
                >
                  Scanné !
                </Text>
                <Text
                  style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}
                >
                  LIV-2847 · Confirmé
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Icon name="scan" size={60} color={COLORS.muted} />
                <Text
                  style={{ color: COLORS.muted, fontSize: 13, marginTop: 12 }}
                >
                  Pointez vers le QR code
                </Text>
              </View>
            )}
          </View>

          {/* Corner decorations */}
          {CORNERS.map((style, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: 24,
                height: 24,
                borderRadius: 2,
                borderColor: COLORS.accent,
                ...style,
              }}
            />
          ))}
        </View>

        <Text
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Scannez le code QR ou code-barres du colis{"\n"}pour confirmer la
          livraison
        </Text>

        <TouchableOpacity
          onPress={() => setScanned(true)}
          style={{
            marginTop: 20,
            borderRadius: 14,
            paddingHorizontal: 32,
            paddingVertical: 14,
            backgroundColor: scanned ? COLORS.green : COLORS.accent,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
            {scanned ? "✓ Livraison confirmée" : "Simuler le scan"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScannerScreen;
