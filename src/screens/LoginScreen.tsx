import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { theme, spacing } from '../theme/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="displayMedium" style={styles.title}>
            CircleLink
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Stay connected with your safety circle
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineSmall" style={styles.cardTitle}>
              Welcome to CircleLink
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Share your location with family and friends for safety and peace of mind.
            </Text>
            
            <View style={styles.features}>
              <Text variant="bodyMedium" style={styles.feature}>
                • Real-time location sharing
              </Text>
              <Text variant="bodyMedium" style={styles.feature}>
                • Emergency SOS alerts
              </Text>
              <Text variant="bodyMedium" style={styles.feature}>
                • Crash detection
              </Text>
              <Text variant="bodyMedium" style={styles.feature}>
                • Battery status monitoring
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={signIn}
              style={styles.signInButton}
              contentStyle={styles.buttonContent}
            >
              Get Started
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: theme.colors.onPrimary,
    opacity: 0.8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: theme.colors.onSurface,
  },
  cardDescription: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: theme.colors.onSurfaceVariant,
  },
  features: {
    marginBottom: spacing.xl,
  },
  feature: {
    marginBottom: spacing.sm,
    color: theme.colors.onSurfaceVariant,
  },
  signInButton: {
    marginTop: spacing.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});