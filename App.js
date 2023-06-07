import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TestScreen from './pages/TestScreen';
import HomeScreen from './pages/HomeScreen';
import ListScreen from './pages/ListScreen';
import NewQuestionScreen from './pages/NewQuestionScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator();

const TabNavigator = (props) => {
  const { initialRouteName } = props
  return (
    <Tab.Navigator initialRouteName={initialRouteName}>
      <Tab.Screen name="📜 List" component={ListScreen} />
      <Tab.Screen name="➕ New" component={NewQuestionScreen} />
      <Tab.Screen name="✅ Test" component={TestScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="🏠 Home" component={HomeScreen} />
        <Stack.Screen name="📜 List Tab">
          {() => TabNavigator({initialRouteName: "📜 List"})}
        </Stack.Screen>
        <Stack.Screen name="➕ New Tab">
          {() => TabNavigator({initialRouteName: "➕ New"})}
        </Stack.Screen>
        <Stack.Screen name="✅ Test Tab">
          {() => TabNavigator({initialRouteName: "✅ Test"})}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
