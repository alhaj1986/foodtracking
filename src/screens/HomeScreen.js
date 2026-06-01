import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { database } from '../firebase.config';
import { ref, onValue } from 'firebase/database';

const HomeScreen = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const foodRef = ref(database, 'foodItems');
    const unsubscribe = onValue(
      foodRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setFoodItems(items);
        }
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => navigation.navigate('FoodDetails', { food: item })}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.foodImage}
        />
      )}
      <View style={styles.foodInfo}>
        <Text style={styles.foodType}>{item.foodType}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity} servings</Text>
        <Text style={styles.location}>
          📍 {item.location || 'Location not specified'}
        </Text>
        <Text style={styles.contact}>
          📞 {item.mobileNumber}
        </Text>
        <Text style={styles.posted}>
          Posted: {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Foods</Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => navigation.navigate('PostFood')}
        >
          <Text style={styles.postButtonText}>+ Post Food</Text>
        </TouchableOpacity>
      </View>

      {foodItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No food items available</Text>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('PostFood')}
          >
            <Text style={styles.postButtonText}>Post First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={foodItems}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2ecc71']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  postButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#2ecc71',
    fontWeight: 'bold',
    fontSize: 12,
  },
  foodCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',
  },
  foodInfo: {
    padding: 12,
  },
  foodType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  contact: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  posted: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
});

export default HomeScreen;
