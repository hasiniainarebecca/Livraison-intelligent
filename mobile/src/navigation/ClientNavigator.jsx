import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Text } from 'react-native'
import { useCart } from '../contexts/CartContext'
import CatalogScreen from '../screens/Client/CatalogScreen'
import CartScreen from '../screens/Client/CartScreen'
import CheckoutScreen from '../screens/Client/CheckoutScreen'
import OrderListScreen from '../screens/Client/OrderListScreen'
import TrackOrderScreen from '../screens/Client/TrackOrderScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Stack pour l'onglet Catalogue (peut naviguer vers Checkout)
function CatalogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CatalogMain" component={CatalogScreen} options={{ title: 'Catalogue' }} />
    </Stack.Navigator>
  )
}

// Stack pour l'onglet Panier
function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'Panier' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Commander' }} />
    </Stack.Navigator>
  )
}

// Stack pour l'onglet Commandes
function OrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrderList" component={OrderListScreen} options={{ title: 'Mes commandes' }} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} options={{ title: 'Suivi commande' }} />
    </Stack.Navigator>
  )
}

function CartTabIcon({ color, size }) {
  const { totalItems } = useCart()
  return (
    <Text style={{ color, fontSize: size }}>
      {totalItems > 0 ? `🛒${totalItems}` : '🛒'}
    </Text>
  )
}

export default function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { paddingBottom: 4, height: 58 },
      }}
    >
      <Tab.Screen
        name="CatalogTab"
        component={CatalogStack}
        options={{ title: 'Catalogue', tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>🏪</Text> }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{ title: 'Panier', tabBarIcon: (props) => <CartTabIcon {...props} /> }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderStack}
        options={{ title: 'Commandes', tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>📦</Text> }}
      />
    </Tab.Navigator>
  )
}
