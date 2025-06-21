import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useCircle } from '../context/CircleContext';
import { theme, spacing } from '../theme/theme';

export default function CreateCircleScreen() {
  const navigation = useNavigation();
  const { createCircle } = useCircle();
  const [circleName, setCircleName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateCircle = async () => {
    if (!circleName.trim()) {
      Alert.alert('Error', 'Please enter a circle name');
      return;
    }

    setLoading(true);
    try {
      const inviteCode = await createCircle(circleName.trim());
      Alert.alert(
        'Circle Created!',
        `Your circle "${circleName}" has been created.\n\nInvite Code: ${inviteCode}\n\nShare this code with family and friends to invite them to your safety circle.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create circle. Please try again.');
      console.error('Create circle error:', error);
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
              Create Safety Circle
            </Text>
            
            <Text variant="bodyMedium" style={styles.description}>
              Create a new safety circle to share your location with family and friends. You'll receive an invite code to share with others.
            </Text>

            <TextInput
              label="Circle Name"
              value={circleName}
              onChangeText={setCircleName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Family, Close Friends, Work Team"
              maxLength={50}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleCreateCircle}
                loading={loading}
                disabled={loading || !circleName.trim()}
                style={styles.createButton}
                contentStyle={styles.buttonContent}
              >
                Create Circle
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
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
              What happens next?
            </Text>
            
            <View style={styles.infoList}>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • You'll receive a unique invite code
              </Text>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Share the code with family and friends
              </Text>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Members can see each other's location and battery status
              </Text>
              <Text variant="bodyMedium" style={styles.infoItem}>
                • Emergency alerts are shared with all circle members
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
  createButton: {
    marginBottom: spacing.sm,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  cancelButton: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: theme.colors.primaryContainer,
  },
  infoTitle: {
    marginBottom: spacing.md,
    color: theme.colors.onPrimaryContainer,
  },
  infoList: {
    gap: spacing.sm,
  },
  infoItem: {
    color: theme.colors.onPrimaryContainer,
  },
});