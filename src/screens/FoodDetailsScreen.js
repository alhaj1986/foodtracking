import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const FoodDetailsScreen = ({ route }) => {
  const { food } = route.params;

  const coordinates = food.location ? food.location.split(',').map(Number) : null;

  const handleCall = () => {
    const phoneNumber = `tel:${food.mobileNumber}`;
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Error', 'Could not make call');
    });
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the ${food.foodType} you posted on Food Tracking App.`;
    const whatsappUrl = `https://wa.me/${food.mobileNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed');
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this food: ${food.foodType} - ${food.quantity} servings available!\nContact: ${food.mobileNumber}`,
        title: 'Food Tracking',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {food.imageUrl && (
        <Image
          source={{ uri: food.imageUrl }}
          style={styles.foodImage}
        />
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.foodType}>{food.foodType}</Text>

        <View style={styles.detailsSection}>
          <DetailRow label="Quantity" value={`${food.quantity} servings`} icon="🍽️" />
          <DetailRow label="Total People" value={`${food.totalPeople} people`} icon="👥" />
          <DetailRow label="Location" value={food.location || 'Not specified'} icon="📍" />
          <DetailRow label="Posted" value={new Date(food.timestamp).toLocaleDateString()} icon="📅" />
        </View>

        {coordinates && (
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Location on Map</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coordinates[0],
                longitude: coordinates[1],
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: coordinates[0],
                  longitude: coordinates[1],
                }}
                title={food.foodType}
              />
            </MapView>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
            <Text style={styles.contactButtonText}>📞 Call {food.mobileNumber}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactButton, styles.whatsappButton]} onPress={handleWhatsApp}>
            <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactButton, styles.shareButton]} onPress={handleShare}>
            <Text style={styles.contactButtonText}>📤 Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerText}>
          <Text style={styles.disclaimer}>
            Please be respectful when collecting food items. Follow all health and safety guidelines.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  foodImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  foodType: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  mapContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  contactButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  shareButton: {
    backgroundColor: '#0084ff',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerText: {
    paddingVertical: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default FoodDetailsScreen;
