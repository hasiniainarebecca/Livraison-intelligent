import React from "react";
import { View, Text } from "react-native";
import { STATUS_COLORS } from "../../constants/livreur/colors";

const StatusBadge = ({ status, small = false }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS["En attente"];

  return (
    <View
      style={{
        backgroundColor: s.bg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: s.dot + "30",
        paddingHorizontal: small ? 8 : 12,
        paddingVertical: small ? 2 : 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      }}
    >
      <View
        style={{
          width: small ? 5 : 6,
          height: small ? 5 : 6,
          borderRadius: 10,
          backgroundColor: s.dot,
        }}
      />
      <Text
        style={{
          color: s.text,
          fontSize: small ? 10 : 11,
          fontWeight: "700",
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {status}
      </Text>
    </View>
  );
};

export default StatusBadge;
