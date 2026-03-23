import { createStackNavigator } from '@react-navigation/stack'
import MissionListScreen from '../screens/Livreur/MissionListScreen'
import MissionDetailScreen from '../screens/Livreur/MissionDetailScreen'

const Stack = createStackNavigator()

export default function LivreurNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MissionList"
        component={MissionListScreen}
        options={{ title: 'Mes missions' }}
      />
      <Stack.Screen
        name="MissionDetail"
        component={MissionDetailScreen}
        options={{ title: 'Détail mission' }}
      />
    </Stack.Navigator>
  )
}
