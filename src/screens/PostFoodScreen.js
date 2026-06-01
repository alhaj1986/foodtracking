import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { database, storage, auth } from '../firebase.config';
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const PostFoodScreen = ({ navigation }) => {
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPeople, setTotalPeople] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setFetchingLocation(true);
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          // In a real app, you'd use a reverse geocoding API to get the address
          setFetchingLocation(false);
        },
        (error) => {
          console.error(error);
          setFetchingLocation(false);
          Alert.alert('Location', 'Could not get your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Location error:', error);
      setFetchingLocation(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image');
        } else if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0]);
        }
      }
    );
  };

  const uploadImageToStorage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const filename = `food_${timestamp}.jpg`;
      const imageRef = storageRef(storage, `foodImages/${filename}`);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handlePostFood = async () => {
    if (!foodType || !quantity || !mobileNumber || !totalPeople) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImageToStorage(image.uri);
      }

      const currentUser = auth.currentUser;
      const foodData = {
        foodType,
        quantity: parseInt(quantity),
        totalPeople: parseInt(totalPeople),
        mobileNumber,
        location,
        imageUrl,
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        timestamp: new Date().getTime(),
        createdAt: new Date().toISOString(),
      };

      const foodRef = dbRef(database, 'foodItems');
      const newFoodRef = push(foodRef);
      await set(newFoodRef, foodData);

      Alert.alert('Success', 'Food item posted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error posting food:', error);
      Alert.alert('Error', 'Failed to post food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post Excess Food</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Food Type *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Biryani, Samosa, Cake"
          value={foodType}
          onChangeText={setFoodType}
          editable={!loading}
        />

        <Text style={styles.label}>Quantity (servings) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of servings"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.label}>Total People Expected *</Text>
        <TextInput
          style={styles.input}
          placeholder="Total people at event"
          value={totalPeople}
          onChangeText={setTotalPeople}
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Your contact number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.label}>Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            placeholder="Location (auto-detected)"
            value={location}
            onChangeText={setLocation}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={getCurrentLocation}
            disabled={loading || fetchingLocation}
          >
            {fetchingLocation ? (
              <ActivityIndicator size="small" color="#2ecc71" />
            ) : (
              <Text style={styles.refreshButtonText}>📍</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Food Image *</Text>
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={pickImage}
          disabled={loading}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <Text style={styles.imagePickerText}>📷 Select Food Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handlePostFood}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post Food Item</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2ecc71',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  refreshButton: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 20,
  },
  imagePickerButton: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  imagePickerPlaceholder: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 18,
    color: '#999',
  },
  postButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostFoodScreen;
