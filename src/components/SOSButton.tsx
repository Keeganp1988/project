import React, { useState } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import { FAB, Portal, Modal, Text, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { theme, spacing } from '../theme/theme';
import { useCircle } from '../context/CircleContext';
import { useLocation } from '../context/LocationContext';

export default function SOSButton() {
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [countdownActive, setCountdownActive] = useState(false);
  const { activeCircle } = useCircle();
  const { location } = useLocation();

  const startSOSCountdown = () => {
    setSosModalVisible(true);
    setCountdownActive(true);
    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendSOSAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    setCountdownActive(false);
    setSosModalVisible(false);
    setCountdown(10);
  };

  const sendSOSAlert = () => {
    setCountdownActive(false);
    setSosModalVisible(false);
    
    // In a real app, this would send the SOS alert to all circle members
    Alert.alert(
      'SOS Alert Sent',
      'Your emergency alert has been sent to all circle members with your current location.',
      [{ text: 'OK' }]
    );
    
    console.log('SOS Alert sent to circle:', activeCircle?.name);
    console.log('Location:', location?.coords);
  };

  const handleSOSPress = () => {
    if (!activeCircle) {
      Alert.alert(
        'No Safety Circle',
        'You need to create or join a safety circle before using the SOS feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Emergency SOS',
      'This will send an emergency alert to all members of your safety circle with your current location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send SOS', onPress: startSOSCountdown, style: 'destructive' },
      ]
    );
  };

  return (
    <>
      <FAB
        icon={() => <Ionicons name="warning" size={24} color="white" />}
        style={styles.sosButton}
        onPress={handleSOSPress}
        label="SOS"
        color="white"
      />

      <Portal>
        <Modal
          visible={sosModalVisible}
          onDismiss={cancelSOS}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <Card.Content style={styles.modalContent}>
              <View style={styles.warningIcon}>
                <Ionicons name="warning" size={64} color={theme.colors.error} />
              </View>
              
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Sending SOS Alert
              </Text>
              
              <Text variant="displayLarge" style={styles.countdown}>
                {countdown}
              </Text>
              
              <Text variant="bodyMedium" style={styles.modalDescription}>
                Emergency alert will be sent to all circle members in {countdown} seconds
              </Text>
              
              <Button
                mode="contained"
                onPress={cancelSOS}
                style={styles.cancelButton}
                buttonColor={theme.colors.error}
              >
                Cancel SOS
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  sosButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    backgroundColor: theme.colors.error,
    borderRadius: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  warningIcon: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: theme.colors.onSurface,
  },
  countdown: {
    color: theme.colors.error,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: theme.colors.onSurfaceVariant,
  },
  cancelButton: {
    minWidth: 200,
  },
});