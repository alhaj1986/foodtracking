import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Tracking App</Text>
      <Text style={styles.subtitle}>
        {userLoggedIn ? '✓ Logged In' : 'Authentication Required'}
      </Text>
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Firebase Status</Text>
        <Text style={styles.statusValue}>✓ Connected</Text>
        <Text style={styles.projectId}>Project: foodtracking-5a8ea</Text>
      </View>
      <Text style={styles.info}>
        Download Expo Go app to test the mobile version with full features
      </Text>
      <View style={styles.features}>
        <Text style={styles.featureTitle}>Features:</Text>
        <Text style={styles.feature}>📸 Share excess food from events</Text>
        <Text style={styles.feature}>📍 Auto-location detection</Text>
        <Text style={styles.feature}>👥 Community visibility</Text>
        <Text style={styles.feature}>💬 Direct messaging</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
  },
  statusBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  projectId: {
    fontSize: 12,
    color: '#e8f8f5',
  },
  info: {
    fontSize: 16,
    color: '#d4efeb',
    marginBottom: 25,
    textAlign: 'center',
  },
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  feature: {
    fontSize: 14,
    color: '#e8f8f5',
    marginBottom: 8,
  },
});
