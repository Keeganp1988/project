import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useCircle } from '../context/CircleContext';
import { theme, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/navigation';

export default function JoinCircleScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { joinCircle } = useCircle();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinCircle = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    setLoading(true);
    try {
      await joinCircle(inviteCode.trim());
      Alert.alert(
        'Joined Circle!',
        'You have successfully joined the safety circle.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CircleMain'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to join circle. Please try again.');
      console.error('Join circle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Join Safety Circle
            </Text>
            
            <Text variant="bodyMedium" style={styles.description}>
              Enter the invite code shared by a family member or friend to join their safety circle.
            </Text>

            <TextInput
              label="Invite Code"
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., ABC123"
              maxLength={6}
              autoCapitalize="characters"
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleJoinCircle}
                loading={loading}
                disabled={loading || !inviteCode.trim()}
                style={styles.joinButton}
                contentStyle={styles.buttonContent}
              >
                Join Circle
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.navigate('CircleMain')}
                disabled={loading}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              About Safety Circles
            </Text>
            
            <View style={styles.infoList}>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Share your real-time location with trusted contacts
              </Text>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Receive emergency alerts from circle members
              </Text>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Monitor battery levels and charging status
              </Text>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Get crash detection and SOS alerts
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: theme.colors.onSurface,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: theme.colors.onSurfaceVariant,
  },
  input: {
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  joinButton: {
    marginBottom: spacing.sm,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  cancelButton: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  infoTitle: {
    marginBottom: spacing.md,
    color: theme.colors.onSecondaryContainer,
  },
  infoList: {
    gap: spacing.sm,
  },
  infoItem: {
    color: theme.colors.onSecondaryContainer,
  },
});