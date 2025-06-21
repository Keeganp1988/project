import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationContextType {
  location: Location.LocationObject | null;
  locationPermission: boolean;
  requestLocationPermission: () => Promise<boolean>;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      setLocationPermission(true);
      return true;
    } else {
      Alert.alert(
        'Location Permission Required',
        'CircleLink needs location access to share your location with your safety circle.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  const startLocationTracking = async () => {
    if (!locationPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }

    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
      
      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        locationPermission,
        requestLocationPermission,
        startLocationTracking,
        stopLocationTracking,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}