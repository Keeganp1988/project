import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, FAB, Card, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Battery from 'expo-battery';
import { Ionicons } from '@expo/vector-icons';

import { useLocation } from '../context/LocationContext';
import { useCircle } from '../context/CircleContext';
import { theme, spacing } from '../theme/theme';

export default function MapScreen() {
  const { location, locationPermission, startLocationTracking, requestLocationPermission } = useLocation();
  const { activeCircle, updateMemberLocation, updateMemberBattery } = useCircle();
  const [batteryLevel, setBatteryLevel] = useState<number>(1);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    initializeTracking();
    setupBatteryMonitoring();
  }, []);

  useEffect(() => {
    if (location) {
      updateMemberLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location]);

  const initializeTracking = async () => {
    if (!locationPermission) {
      const granted = await requestLocationPermission();
      if (granted) {
        startLocationTracking();
      }
    } else {
      startLocationTracking();
    }
  };

  const setupBatteryMonitoring = async () => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      const charging = await Battery.getBatteryStateAsync();
      
      setBatteryLevel(level);
      setIsCharging(charging === Battery.BatteryState.CHARGING);

      updateMemberBattery({
        level: Math.round(level * 100),
        isCharging: charging === Battery.BatteryState.CHARGING,
      });

      // Set up battery level monitoring
      const levelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
        updateMemberBattery({
          level: Math.round(batteryLevel * 100),
          isCharging,
        });
      });

      const stateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
        const charging = batteryState === Battery.BatteryState.CHARGING;
        setIsCharging(charging);
        updateMemberBattery({
          level: Math.round(batteryLevel * 100),
          isCharging: charging,
        });
      });

      return () => {
        levelSubscription.remove();
        stateSubscription.remove();
      };
    } catch (error) {
      console.error('Battery monitoring error:', error);
    }
  };

  const handleLocationRequest = () => {
    if (!locationPermission) {
      requestLocationPermission();
    }
  };

  if (!locationPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Card style={styles.permissionCard}>
            <Card.Content>
              <View style={styles.permissionIcon}>
                <Ionicons name="location-outline" size={64} color={theme.colors.primary} />
              </View>
              <Text variant="headlineSmall" style={styles.permissionTitle}>
                Location Access Required
              </Text>
              <Text variant="bodyMedium" style={styles.permissionDescription}>
                CircleLink needs location access to share your location with your safety circle and provide emergency features.
              </Text>
              <FAB
                icon="location"
                label="Enable Location"
                onPress={handleLocationRequest}
                style={styles.permissionButton}
              />
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {activeCircle?.members.map((member) => (
          member.location && (
            <Marker
              key={member.id}
              coordinate={{
                latitude: member.location.latitude,
                longitude: member.location.longitude,
              }}
              title={member.name}
              description={`Battery: ${member.battery?.level || 0}%`}
            />
          )
        ))}
      </MapView>

      <View style={styles.statusBar}>
        <Chip
          icon={isCharging ? 'battery-charging' : 'battery'}
          style={[
            styles.batteryChip,
            batteryLevel < 0.15 && styles.lowBatteryChip
          ]}
        >
          {Math.round(batteryLevel * 100)}%
        </Chip>
        
        {activeCircle && (
          <Chip icon="people" style={styles.circleChip}>
            {activeCircle.name}
          </Chip>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  permissionCard: {
    padding: spacing.lg,
  },
  permissionIcon: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  permissionTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: theme.colors.onSurface,
  },
  permissionDescription: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: theme.colors.onSurfaceVariant,
  },
  permissionButton: {
    alignSelf: 'center',
  },
  statusBar: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batteryChip: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  lowBatteryChip: {
    backgroundColor: theme.colors.errorContainer,
  },
  circleChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
});