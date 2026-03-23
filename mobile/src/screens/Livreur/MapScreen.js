import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Linking,
  Dimensions,
} from "react-native";
import { Svg, Line, Rect, Circle, G } from "react-native-svg";
import Icon from "../../components/livreur/Icon";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";
import { deliveries } from "../../data/livreur/deliveries";

const { width: W, height: H } = Dimensions.get("window");

const MapScreen = ({ onNavigate }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const activeDelivery = deliveries.find((d) => d.status === "En cours");

  const dots = [
    { x: W * 0.52, y: H * 0.42, color: COLORS.accent, label: "Vous" },
    {
      x: W * 0.72,
      y: H * 0.28,
      color: COLORS.teal,
      label: activeDelivery?.client,
    },
    { x: W * 0.3, y: H * 0.62, color: COLORS.yellow, label: "En attente" },
  ];

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#0D1520" }}>
      {/* ── SVG Map ── */}
      <Svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox={`0 0 ${W} ${H}`}
      >
        {/* Grid */}
        {Array.from({ length: 20 }).map((_, i) => (
          <G key={i} opacity={0.15}>
            <Line
              x1={(i * W) / 18}
              y1="0"
              x2={(i * W) / 18}
              y2={H}
              stroke={COLORS.teal}
              strokeWidth="0.5"
            />
            <Line
              x1="0"
              y1={(i * H) / 18}
              x2={W}
              y2={(i * H) / 18}
              stroke={COLORS.teal}
              strokeWidth="0.5"
            />
          </G>
        ))}

        {/* Roads */}
        <Line
          x1={W * 0.3}
          y1="0"
          x2={W * 0.52}
          y2={H * 0.42}
          stroke="#1E3A4A"
          strokeWidth="12"
        />
        <Line
          x1={W * 0.52}
          y1={H * 0.42}
          x2={W * 0.72}
          y2={H * 0.28}
          stroke="#1E3A4A"
          strokeWidth="8"
          strokeDasharray="12,6"
        />
        <Line
          x1={W * 0.52}
          y1={H * 0.42}
          x2={W * 0.3}
          y2={H * 0.62}
          stroke="#1E3A4A"
          strokeWidth="8"
        />
        <Line
          x1="0"
          y1={H * 0.55}
          x2={W}
          y2={H * 0.55}
          stroke="#162030"
          strokeWidth="10"
        />
        <Line
          x1={W * 0.6}
          y1="0"
          x2={W * 0.6}
          y2={H}
          stroke="#162030"
          strokeWidth="10"
        />

        {/* Route highlight */}
        <Line
          x1={W * 0.52}
          y1={H * 0.42}
          x2={W * 0.72}
          y2={H * 0.28}
          stroke={COLORS.accent}
          strokeWidth="3"
          strokeDasharray="8,4"
          opacity="0.8"
        />

        {/* Buildings */}
        {[
          [0.1, 0.2],
          [0.15, 0.35],
          [0.75, 0.6],
          [0.8, 0.4],
          [0.4, 0.7],
          [0.85, 0.75],
        ].map(([x, y], i) => (
          <Rect
            key={i}
            x={W * x}
            y={H * y}
            width={W * 0.06}
            height={H * 0.05}
            rx="3"
            fill="#162535"
            stroke="#1E3A4A"
            strokeWidth="1"
          />
        ))}

        {/* Location dots */}
        {dots.map((dot, i) => (
          <G key={i}>
            <Circle
              cx={dot.x}
              cy={dot.y}
              r="20"
              fill={dot.color}
              fillOpacity="0.08"
            />
            <Circle
              cx={dot.x}
              cy={dot.y}
              r="12"
              fill={dot.color}
              fillOpacity="0.15"
            />
            <Circle cx={dot.x} cy={dot.y} r="7" fill={dot.color} />
            <Circle cx={dot.x} cy={dot.y} r="3" fill="#fff" />
          </G>
        ))}
      </Svg>

      {/* ── Pulse ring ── */}
      <Animated.View
        style={{
          position: "absolute",
          left: W * 0.52 - 30,
          top: H * 0.42 - 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          borderWidth: 2,
          borderColor: COLORS.accent,
          transform: [{ scale: pulseScale }],
          opacity: pulseOpacity,
        }}
      />

      {/* ── Header overlay ── */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingTop: 52,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onNavigate(SCREENS.HOME)}
            style={{
              backgroundColor: COLORS.card + "CC",
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
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.card + "CC",
              borderRadius: 12,
              padding: 10,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{ color: COLORS.muted, fontSize: 10 }}>
              Destination
            </Text>
            <Text
              style={{
                color: COLORS.text,
                fontSize: 13,
                fontWeight: "700",
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {activeDelivery?.address || "Aucune livraison active"}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Legend ── */}
      <View
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          backgroundColor: COLORS.card + "CC",
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
          gap: 12,
        }}
      >
        {[
          { color: COLORS.accent, label: "Vous" },
          { color: COLORS.teal, label: "Client" },
          { color: COLORS.yellow, label: "File" },
        ].map((item) => (
          <View
            key={item.label}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: item.color,
              }}
            />
            <Text style={{ color: COLORS.muted, fontSize: 9 }}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Bottom Panel ── */}
      {activeDelivery && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.card + "F0",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 16,
            paddingBottom: 32,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>ETA</Text>
              <Text
                style={{
                  color: COLORS.accent,
                  fontSize: 28,
                  fontWeight: "800",
                }}
              >
                {activeDelivery.eta}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: COLORS.muted, fontSize: 11 }}>
                Distance
              </Text>
              <Text
                style={{ color: COLORS.text, fontSize: 28, fontWeight: "800" }}
              >
                {activeDelivery.distance}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${activeDelivery.phone}`)}
              style={{
                flex: 1,
                backgroundColor: COLORS.cardLight,
                borderRadius: 14,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Icon name="phone" size={16} color={COLORS.green} />
              <Text
                style={{ color: COLORS.text, fontWeight: "700", fontSize: 14 }}
              >
                Appeler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 2,
                backgroundColor: COLORS.accent,
                borderRadius: 14,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Icon name="navigation" size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>
                Lancer la navigation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
