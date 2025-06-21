# CircleLink - React Native App

A React Native mobile application for creating and managing safety circles with real-time location sharing and SOS functionality.

## Features

- **User Authentication**: Secure login and registration system
- **Circle Management**: Create and join safety circles
- **Real-time Location Sharing**: Share your location with circle members
- **SOS Button**: Emergency alert system for quick help
- **Interactive Map**: View circle members on a map interface
- **Settings Management**: Customize app preferences

## Tech Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Backend services (Authentication, Firestore)
- **React Navigation**: Navigation between screens
- **Expo**: Development tools and services

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Download your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files
   - Place them in the appropriate directories:
     - Android: `android/app/google-services.json`
     - iOS: `ios/GoogleService-Info.plist`

5. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     FIREBASE_APP_ID=your_app_id
     ```

## Running the App

### Android
```bash
npx react-native run-android
```

### iOS (macOS only)
```bash
npx react-native run-ios
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── context/            # React Context providers
├── screens/            # Screen components
├── theme/              # Theme and styling
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team. 