import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ProfileScreen from './screens/ProfileScreen';
import ListScreen from './screens/ListScreen';
import GridScreen from './screens/GridScreen';
import CardsScreen from './screens/CardsScreen';

const Tab = createBottomTabNavigator();

const icon = emoji => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ tabBarIcon: icon('👤') }}
          />
          <Tab.Screen
            name="List"
            component={ListScreen}
            options={{ tabBarIcon: icon('📋') }}
          />
          <Tab.Screen
            name="Grid"
            component={GridScreen}
            options={{ tabBarIcon: icon('🖼️') }}
          />
          <Tab.Screen
            name="Cards"
            component={CardsScreen}
            options={{ tabBarIcon: icon('🗂️') }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
