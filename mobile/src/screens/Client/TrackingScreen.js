import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Linking,
  Dimensions,
} from "react-native";
import { Svg, Rect, Line, Circle } from "react-native-svg";
import Icon from "../../components/client/Icon";
import StatusBadge from "../../components/client/StatusBadge";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const { width: W, height: H } = Dimensions.get("window");

const TrackingScreen = ({ order, onNavigate }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  if (!order) return null;

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* ── Map area ── */}
      <View
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#EEF4EE",
        }}
      >
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
          <Rect width={W} height={H} fill="#EEF4EE" />
          {/* Roads */}
          {[
            [0, H * 0.55, W, H * 0.55, 14],
            [W * 0.4, 0, W * 0.4, H, 12],
            [0, H * 0.3, W * 0.7, H * 0.6, 10],
            [W * 0.6, 0, W * 0.8, H, 8],
          ].map(([x1, y1, x2, y2, w], i) => (
            <Line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#D4E4D4"
              strokeWidth={w}
            />
          ))}
          {/* Route */}
          <Line
            x1={W * 0.35}
            y1={H * 0.65}
            x2={W * 0.65}
            y2={H * 0.35}
            stroke={C.primary}
            strokeWidth="3"
            strokeDasharray="10,5"
          />
          {/* Blocks */}
          {[
            [0.1, 0.2],
            [0.2, 0.65],
            [0.55, 0.65],
            [0.75, 0.3],
            [0.8, 0.7],
            [0.15, 0.4],
            [0.6, 0.15],
          ].map(([x, y], i) => (
            <Rect
              key={i}
              x={W * x}
              y={H * y}
              width={W * 0.08}
              height={H * 0.06}
              rx="4"
              fill="#D8EAD8"
              stroke="#C8DCC8"
              strokeWidth="1"
            />
          ))}
          {/* Trees */}
          {[
            [0.5, 0.5],
            [0.3, 0.3],
            [0.7, 0.7],
          ].map(([x, y], i) => (
            <Circle
              key={i}
              cx={W * x}
              cy={H * y}
              r="8"
              fill="#B8D4B8"
              fillOpacity="0.6"
            />
          ))}
          {/* Destination dot */}
          <Circle
            cx={W * 0.65}
            cy={H * 0.35}
            r="14"
            fill={C.primary}
            fillOpacity="0.15"
          />
          <Circle cx={W * 0.65} cy={H * 0.35} r="9" fill={C.primary} />
          <Circle cx={W * 0.65} cy={H * 0.35} r="4" fill="#fff" />
        </Svg>

        {/* Driver dot with pulse */}
        <Animated.View
          style={{
            position: "absolute",
            left: W * 0.35 - 20,
            top: H * 0.65 - 20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: C.accent,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
        />
        <View
          style={{
            position: "absolute",
            left: W * 0.35 - 8,
            top: H * 0.65 - 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: C.accent,
            borderWidth: 3,
            borderColor: "#fff",
          }}
        />

        {/* Header overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: 52,
            paddingHorizontal: 20,
            paddingBottom: 16,
            backgroundColor: "rgba(238,244,238,0.92)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.HOME)}
              style={{
                backgroundColor: C.white + "CC",
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
            <View
              style={{
                flex: 1,
                backgroundColor: C.white + "CC",
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ color: C.muted, fontSize: 10 }}>Suivi de</Text>
              <Text style={{ color: C.text, fontSize: 13, fontWeight: "700" }}>
                {order.id}
              </Text>
            </View>
            <StatusBadge status={order.status} small />
          </View>
        </View>

        {/* ETA chip */}
        <View
          style={{
            position: "absolute",
            bottom: 20,
            alignSelf: "center",
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: C.green,
              shadowColor: C.green,
              shadowOpacity: 1,
              shadowRadius: 4,
            }}
          />
          <Text style={{ color: C.text, fontWeight: "800", fontSize: 14 }}>
            Arrivée dans {order.eta}
          </Text>
        </View>
      </View>

      {/* ── Bottom Panel ── */}
      <View
        style={{
          backgroundColor: C.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          paddingBottom: 32,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* Driver */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: C.primary,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 20 }}>
              {order.driver.name[0]}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 16 }}>
              {order.driver.name}
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
              {order.driver.vehicle}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 3,
              }}
            >
              <Icon name="star" size={12} color={C.yellow} />
              <Text
                style={{ color: C.yellow, fontWeight: "700", fontSize: 12 }}
              >
                {order.driver.rating}
              </Text>
              <Text style={{ color: C.muted, fontSize: 11 }}>
                · Votre livreur
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${order.driver.phone}`)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: C.primaryLt,
              borderWidth: 1,
              borderColor: C.primary + "30",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="phone" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View style={{ marginBottom: 16 }}>
          {order.timeline.map((step, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: i < order.timeline.length - 1 ? 12 : 0,
              }}
            >
              <View style={{ alignItems: "center", flexShrink: 0 }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: step.done ? C.primary : C.bgDeep,
                    borderWidth: 2,
                    borderColor: step.done ? C.primary : C.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.done && <Icon name="check" size={12} color="#fff" />}
                </View>
                {i < order.timeline.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      height: 16,
                      backgroundColor: step.done ? C.primary : C.border,
                      marginTop: 2,
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  paddingTop: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: step.done ? C.text : C.muted,
                    fontWeight: step.done ? "700" : "400",
                    fontSize: 13,
                  }}
                >
                  {step.label}
                </Text>
                <Text style={{ color: C.muted, fontSize: 11 }}>
                  {step.time}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.ORDER_DETAIL)}
          style={{
            backgroundColor: C.bg,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 14,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: C.primary, fontWeight: "700", fontSize: 14 }}>
            Voir les détails de la commande
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrackingScreen;
