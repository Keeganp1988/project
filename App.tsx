import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from './src/theme/theme';
import { LocationProvider } from './src/context/LocationContext';
import { CircleProvider } from './src/context/CircleContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import MapScreen from './src/screens/MapScreen';
import CircleScreen from './src/screens/CircleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateCircleScreen from './src/screens/CreateCircleScreen';
import JoinCircleScreen from './src/screens/JoinCircleScreen';

// Components
import SOSButton from './src/components/SOSButton';
import LoadingScreen from './src/components/LoadingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CircleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CircleMain" 
        component={CircleScreen} 
        options={{ title: 'My Circle' }}
      />
      <Stack.Screen 
        name="CreateCircle" 
        component={CreateCircleScreen} 
        options={{ title: 'Create Circle' }}
      />
      <Stack.Screen 
        name="JoinCircle" 
        component={JoinCircleScreen} 
        options={{ title: 'Join Circle' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Circle') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
          },
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Circle" component={CircleStack} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <SOSButton />
    </>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <LocationProvider>
            <CircleProvider>
              <AppContent />
              <StatusBar style="light" />
            </CircleProvider>
          </LocationProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}