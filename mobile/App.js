import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { StripeProvider } from '@stripe/stripe-react-native'
import { AuthProvider } from './src/contexts/AuthContext'
import { CartProvider } from './src/contexts/CartContext'
import RootNavigator from './src/navigation/RootNavigator'
import { navigationRef } from './src/navigation/navigationRef'

export default function App() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK ?? ''}>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </StripeProvider>
  )
}
