import React, { useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";

import { C } from "./src/constants/client/colors";
import { SCREENS } from "./src/constants/client/screens";
import { ORDERS } from "./src/data/client/orders";

import BottomNav from "./src/components/client/BottomNav";
import HomeScreen from "./src/screens/Client/HomeScreen";
import NewOrderScreen from "./src/screens/Client/NewOrderScreen";
import TrackingScreen from "./src/screens/Client/TrackingScreen";
import OrderDetailScreen from "./src/screens/Client/OrderDetailScreen";
import HistoryScreen from "./src/screens/Client/HistoryScreen";
import ProfileScreen from "./src/screens/Client/ProfileScreen";
import NotificationsScreen from "./src/screens/Client/NotificationsScreen";
import RateScreen from "./src/screens/Client/RateScreen";
import ConfirmScreen from "./src/screens/Client/ConfirmScreen";

export default function Client() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [selectedOrder, setSelectedOrder] = useState(ORDERS[0]);

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.HOME:
        return (
          <HomeScreen onNavigate={setScreen} onSelectOrder={setSelectedOrder} />
        );
      case SCREENS.NEW_ORDER:
        return <NewOrderScreen onNavigate={setScreen} />;
      case SCREENS.TRACKING:
        return <TrackingScreen order={selectedOrder} onNavigate={setScreen} />;
      case SCREENS.ORDER_DETAIL:
        return (
          <OrderDetailScreen order={selectedOrder} onNavigate={setScreen} />
        );
      case SCREENS.HISTORY:
        return (
          <HistoryScreen
            onNavigate={setScreen}
            onSelectOrder={setSelectedOrder}
          />
        );
      case SCREENS.PROFILE:
        return <ProfileScreen onNavigate={setScreen} />;
      case SCREENS.NOTIFICATIONS:
        return <NotificationsScreen onNavigate={setScreen} />;
      case SCREENS.CONFIRM:
        return <ConfirmScreen onNavigate={setScreen} />;
      case SCREENS.RATE:
        return <RateScreen order={selectedOrder} onNavigate={setScreen} />;
      default:
        return (
          <HomeScreen onNavigate={setScreen} onSelectOrder={setSelectedOrder} />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={{ flex: 1 }}>
        {renderScreen()}
        <BottomNav current={screen} onNavigate={setScreen} />
      </View>
    </SafeAreaView>
  );
}
