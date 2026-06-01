import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

// Navigation imports - only for mobile platforms
let NavigationContainer = null;
let Stack = null;
let Tab = null;

if (Platform.OS !== 'web') {
  NavigationContainer = require('@react-navigation/native').NavigationContainer;
  Stack = require('@react-navigation/native-stack').createNativeStackNavigator();
  Tab = require('@react-navigation/bottom-tabs').createBottomTabNavigator();
}

// Screen imports
let AuthScreen = null;
let HomeScreen = null;
let PostFoodScreen = null;
let FoodDetailsScreen = null;
let ProfileScreen = null;

// Import screens only for native platforms
if (Platform.OS !== 'web') {
  AuthScreen = require('./src/screens/AuthScreen').default;
  HomeScreen = require('./src/screens/HomeScreen').default;
  PostFoodScreen = require('./src/screens/PostFoodScreen').default;
  FoodDetailsScreen = require('./src/screens/FoodDetailsScreen').default;
  ProfileScreen = require('./src/screens/ProfileScreen').default;
}

// Web-only app component
const WebApp = ({ userLoggedIn }) => {
  return (
    <View style={styles.webContainer}>
      <Text style={styles.webTitle}>Food Tracking App</Text>
      <Text style={styles.webText}>
        {userLoggedIn ? 'Logged In - Main App' : 'Authentication Required'}
      </Text>
      <Text style={styles.webSubtext}>Firebase: Connected ✓</Text>
      <Text style={styles.webInfo}>Download Expo Go to test on mobile</Text>
    </View>
  );
};

// Native app component
const NativeApp = ({ userLoggedIn }) => {
  if (!Stack || !Tab || !NavigationContainer) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
        />
        <Tab.Screen
          name="PostTab"
          component={PostFoodScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>➕</Text> }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
        />
      </Tab.Navigator>
    );
  };

  const RootNavigator = () => {
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

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const App = () => {
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
        <Text>Loading...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return <WebApp userLoggedIn={userLoggedIn} />;
  }

  return <NativeApp userLoggedIn={userLoggedIn} />;
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  webText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  webSubtext: {
    fontSize: 16,
    color: '#e8f8f5',
    marginBottom: 30,
    fontWeight: '600',
  },
  webInfo: {
    fontSize: 14,
    color: '#d4efeb',
    fontStyle: 'italic',
  },
});

export default App;
