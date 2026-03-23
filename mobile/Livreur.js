import React, { useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";

import { COLORS } from "./src/constants/livreur/colors";
import { SCREENS } from "./src/constants/livreur/screens";

import BottomNav from "./src/components/livreur/BottomNav";
import HomeScreen from "./src/screens/Livreur/HomeScreen";
import DeliveryDetailScreen from "./src/screens/Livreur/DeliveryDetailScreen";
import MapScreen from "./src/screens/Livreur/MapScreen";
import HistoryScreen from "./src/screens/Livreur/HistoryScreen";
import ScannerScreen from "./src/screens/Livreur/ScannerScreen";
import NotificationsScreen from "./src/screens/Livreur/NotificationsScreen";
import ProfileScreen from "./src/screens/Livreur/ProfileScreen";

export default function Livreur() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.HOME:
        return (
          <HomeScreen
            onNavigate={setScreen}
            onSelectDelivery={setSelectedDelivery}
          />
        );
      case SCREENS.DELIVERY_DETAIL:
        return (
          <DeliveryDetailScreen
            delivery={selectedDelivery}
            onNavigate={setScreen}
          />
        );
      case SCREENS.MAP:
        return <MapScreen onNavigate={setScreen} />;
      case SCREENS.HISTORY:
        return (
          <HistoryScreen
            onNavigate={setScreen}
            onSelectDelivery={setSelectedDelivery}
          />
        );
      case SCREENS.PROFILE:
        return <ProfileScreen onNavigate={setScreen} />;
      case SCREENS.NOTIFICATIONS:
        return <NotificationsScreen onNavigate={setScreen} />;
      case SCREENS.SCANNER:
        return <ScannerScreen onNavigate={setScreen} />;
      default:
        return (
          <HomeScreen
            onNavigate={setScreen}
            onSelectDelivery={setSelectedDelivery}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={{ flex: 1 }}>
        {renderScreen()}
        <BottomNav current={screen} onNavigate={setScreen} />
      </View>
    </SafeAreaView>
  );
}
