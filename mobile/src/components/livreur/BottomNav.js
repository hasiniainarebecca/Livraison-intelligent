import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Icon from "./Icon";
import { COLORS } from "../../constants/livreur/colors";
import { SCREENS } from "../../constants/livreur/screens";

const TABS = [
  { id: SCREENS.HOME, icon: "home", label: "Accueil" },
  { id: SCREENS.MAP, icon: "map", label: "Carte" },
  { id: SCREENS.HISTORY, icon: "history", label: "Historique" },
  { id: SCREENS.PROFILE, icon: "user", label: "Profil" },
];

const SHOW_ON = [SCREENS.HOME, SCREENS.MAP, SCREENS.HISTORY, SCREENS.PROFILE];

const BottomNav = ({ current, onNavigate }) => {
  if (!SHOW_ON.includes(current)) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: COLORS.card,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Platform.OS === "ios" ? 20 : 8,
      }}
    >
      {TABS.map((tab) => {
        const active = current === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onNavigate(tab.id)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 4,
              gap: 3,
            }}
          >
            <Icon
              name={tab.icon}
              size={22}
              color={active ? COLORS.accent : COLORS.muted}
            />
            <Text
              style={{
                color: active ? COLORS.accent : COLORS.muted,
                fontSize: 10,
                fontWeight: active ? "700" : "400",
              }}
            >
              {tab.label}
            </Text>
            {active && (
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: COLORS.accent,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;
