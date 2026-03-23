import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Icon from "./Icon";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const TABS = [
  { id: SCREENS.HOME, icon: "home", label: "Accueil" },
  { id: SCREENS.NEW_ORDER, icon: "plus", label: "Commander" },
  { id: SCREENS.HISTORY, icon: "history", label: "Commandes" },
  { id: SCREENS.PROFILE, icon: "user", label: "Profil" },
];

const SHOW_ON = [
  SCREENS.HOME,
  SCREENS.NEW_ORDER,
  SCREENS.HISTORY,
  SCREENS.PROFILE,
  SCREENS.NOTIFICATIONS,
];

const BottomNav = ({ current, onNavigate }) => {
  if (!SHOW_ON.includes(current)) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: C.card,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingBottom: Platform.OS === "ios" ? 20 : 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {TABS.map((tab) => {
        const active =
          current === tab.id ||
          (current === SCREENS.NOTIFICATIONS && tab.id === SCREENS.HOME);
        const isCenter = tab.id === SCREENS.NEW_ORDER;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onNavigate(tab.id)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingTop: isCenter ? 0 : 10,
              paddingBottom: 4,
              gap: 2,
            }}
          >
            {isCenter ? (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  backgroundColor: C.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -24,
                  borderWidth: 3,
                  borderColor: C.card,
                  shadowColor: C.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Icon name="plus" size={24} color="#fff" />
              </View>
            ) : (
              <Icon
                name={tab.icon}
                size={22}
                color={active ? C.primary : C.muted}
              />
            )}
            <Text
              style={{
                color: isCenter ? C.primary : active ? C.primary : C.muted,
                fontSize: 10,
                fontWeight: active || isCenter ? "700" : "400",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;
