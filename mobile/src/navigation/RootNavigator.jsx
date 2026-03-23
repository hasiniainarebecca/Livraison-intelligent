import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import LoginScreen from '../screens/Auth/LoginScreen'
import RegisterScreen from '../screens/Auth/RegisterScreen'
import CatalogScreen from '../screens/Client/CatalogScreen'
import ClientNavigator from './ClientNavigator'
import LivreurNavigator from './LivreurNavigator'
import Livreur from '../../Livreur'
import Client from '../../Client'



const Stack = createStackNavigator()

export default function RootNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Catalog" component={CatalogScreen} />
        <Stack.Screen name="livreur" component={Livreur} />
        <Stack.Screen name="client" component={Client} />
      </Stack.Navigator>
    )
  }

  if (user.role === 'livreur') {
    return <LivreurNavigator />
  }

  return <ClientNavigator />
}
