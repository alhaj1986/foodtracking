import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import PostFoodScreen from './src/screens/PostFoodScreen';
import FoodDetailsScreen from './src/screens/FoodDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="FoodDetails" 
        component={FoodDetailsScreen}
        options={{ headerShown: true, title: 'Food Details' }}
      />
      <Stack.Screen 
        name="PostFood" 
        component={PostFoodScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#f0f0f0' },
        tabBarLabel: () => null,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarIcon: () => <View style={{ fontSize: 24 }}>🏠</View> }}
      />
      <Tab.Screen
        name="PostTab"
        component={PostFoodScreen}
        options={{ tabBarIcon: () => <View style={{ fontSize: 24 }}>➕</View> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <View style={{ fontSize: 24 }}>👤</View> }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = ({ userLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userLoggedIn ? (
        <Stack.Screen name="App" component={AppTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator userLoggedIn={userLoggedIn} />
    </NavigationContainer>
  );
}
