# Food Tracking App

A React Native mobile application that helps connect people with excess food from parties, marriages, and events to those in need. Users can post available food with details, location, and contact information while others can view and request the food items.

## Features

✅ **User Authentication**
- Email login/signup
- WhatsApp login integration
- Secure Firebase authentication

✅ **Post Food Items**
- Upload food images
- Specify food type and quantity
- Add mobile contact number
- Automatic location detection via GPS
- Manual location input option

✅ **Browse Available Food**
- View all posted food items with images
- See food quantity and details
- Check location on Google Maps
- Total people information

✅ **Contact & Communication**
- Direct phone call to poster
- WhatsApp messaging integration
- Share food listings with others

✅ **User Profile**
- View posted items
- Account settings
- Help & support section

✅ **Push Notifications**
- Real-time updates on new food posts
- Location-based notifications

## Tech Stack

- **Frontend:** React Native (Cross-platform - Android & iOS)
- **Navigation:** React Navigation (Stack & Tab Navigation)
- **Backend:** Firebase
  - Authentication (Email, WhatsApp)
  - Realtime Database (Data storage)
  - Cloud Storage (Image uploads)
  - Cloud Messaging (Push notifications)
- **Maps:** Google Maps integration
- **Media:** Image picker and camera integration

## Project Structure

```
foodtracking/
├── App.js                              # Main app component with navigation
├── index.js                            # Entry point
├── firebase.config.js                  # Firebase configuration
├── package.json                        # Dependencies
├── app.json                           # App metadata
├── .gitignore                         # Git ignore rules
├── src/
│   └── screens/
│       ├── AuthScreen.js              # Login/Signup screen
│       ├── HomeScreen.js              # Food listings
│       ├── PostFoodScreen.js          # Post new food item
│       ├── FoodDetailsScreen.js       # View food details
│       └── ProfileScreen.js           # User profile
└── README.md                          # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14+) and npm installed
- Android Studio with Android SDK (for Android development)
- Xcode (for iOS development)
- Firebase project setup

### Step 1: Clone and Install Dependencies

```bash
cd foodtracking
npm install
```

### Step 2: Set Up Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email and WhatsApp login)
3. Create a Realtime Database
4. Create Cloud Storage bucket
5. Enable Cloud Messaging

6. Update `firebase.config.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'YOUR_DATABASE_URL',
};
```

### Step 3: Set Up Google Maps

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps SDK for Android/iOS
3. Update `app.json` with your Google Maps API key:

```json
"plugins": [
  [
    "react-native-maps",
    {
      "Maps": {
        "GOOGLE_MAPS_API_KEY": "YOUR_GOOGLE_MAPS_API_KEY"
      }
    }
  ]
]
```

### Step 4: Run the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

**Start Metro Bundler:**
```bash
npm start
```

## Firebase Database Structure

### Food Items Collection
```
foodItems/
  foodItem1/
    ├── foodType: "Biryani"
    ├── quantity: 50
    ├── totalPeople: 200
    ├── mobileNumber: "+92XXXXXXXXXX"
    ├── location: "34.0522,-118.2437"
    ├── imageUrl: "https://storage.googleapis.com/..."
    ├── userId: "user123"
    ├── userEmail: "user@example.com"
    ├── timestamp: 1717286400000
    └── createdAt: "2024-06-01T00:00:00Z"
```

## Usage

### 1. **Sign Up / Login**
   - Create account with email or WhatsApp
   - Verify authentication

### 2. **Post Food**
   - Click "+" button
   - Upload food image
   - Enter food details
   - Set quantity and people count
   - Location auto-detects
   - Submit post

### 3. **Browse Food**
   - See all available food items
   - Pull to refresh listings
   - Tap item for details

### 4. **Request Food**
   - View food details and location on map
   - Call the poster directly
   - Message via WhatsApp
   - Share listing with friends

### 5. **Manage Profile**
   - View your posted items
   - Update preferences
   - Access help & support

## Permissions Required

### Android
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS
```xml
NSLocationWhenInUseUsageDescription
NSCameraUsageDescription
NSPhotoLibraryUsageDescription
```

## API Endpoints & Services

- **Authentication:** Firebase Authentication REST API
- **Database:** Firebase Realtime Database
- **Storage:** Firebase Cloud Storage
- **Messaging:** Firebase Cloud Messaging
- **Maps:** Google Maps API

## Building for Production

### Android Release Build
```bash
npm run build:android
```

### iOS Release Build
```bash
npm run build:ios
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@foodtracking.com
- WhatsApp Support: +92XXXXXXXXXX

## Roadmap

- [ ] Advanced search and filters
- [ ] Rating and review system
- [ ] Food wastage statistics
- [ ] Community impact dashboard
- [ ] Integration with NGOs
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Improved analytics

## Disclaimer

This app is designed to help reduce food waste and support communities. Users must comply with local food safety regulations and health guidelines when collecting and sharing food items.

---

**Made with ❤️ to reduce food waste and help communities**
