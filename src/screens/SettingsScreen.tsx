import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Switch, Button, Card, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { theme, spacing } from '../theme/theme';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [crashDetection, setCrashDetection] = React.useState(true);
  const [speedingAlerts, setSpeedingAlerts] = React.useState(true);
  const [batteryAlerts, setBatteryAlerts] = React.useState(true);
  const [locationSharing, setLocationSharing] = React.useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Safety Features
            </Text>
            
            <List.Item
              title="Crash Detection"
              description="Automatically detect crashes and send alerts"
              right={() => (
                <Switch
                  value={crashDetection}
                  onValueChange={setCrashDetection}
                />
              )}
            />
            
            <List.Item
              title="Speeding Alerts"
              description="Alert circle members when speeding"
              right={() => (
                <Switch
                  value={speedingAlerts}
                  onValueChange={setSpeedingAlerts}
                />
              )}
            />
            
            <List.Item
              title="Battery Alerts"
              description="Notify when battery is low"
              right={() => (
                <Switch
                  value={batteryAlerts}
                  onValueChange={setBatteryAlerts}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Privacy
            </Text>
            
            <List.Item
              title="Location Sharing"
              description="Share your location with circle members"
              right={() => (
                <Switch
                  value={locationSharing}
                  onValueChange={setLocationSharing}
                />
              )}
            />
            
            <List.Item
              title="Data & Privacy"
              description="Manage your data and privacy settings"
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Support
            </Text>
            
            <List.Item
              title="Help & FAQ"
              description="Get help and find answers"
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
            />
            
            <List.Item
              title="Contact Support"
              description="Get in touch with our support team"
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
            />
            
            <List.Item
              title="About CircleLink"
              description="App version and information"
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        <View style={styles.signOutContainer}>
          <Button
            mode="outlined"
            onPress={handleSignOut}
            style={styles.signOutButton}
            textColor={theme.colors.error}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    color: theme.colors.onSurface,
  },
  signOutContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  signOutButton: {
    borderColor: theme.colors.error,
  },
});