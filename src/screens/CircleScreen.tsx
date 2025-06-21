import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Avatar, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useCircle } from '../context/CircleContext';
import { theme, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/navigation';

export default function CircleScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { circles, activeCircle, setActiveCircle } = useCircle();

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getBatteryColor = (level: number) => {
    if (level < 15) return theme.colors.error;
    if (level < 30) return theme.colors.tertiary;
    return theme.colors.secondary;
  };

  if (circles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Card style={styles.emptyCard}>
            <Card.Content>
              <View style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={64} color={theme.colors.onSurfaceVariant} />
              </View>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                No Safety Circle Yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyDescription}>
                Create a new circle or join an existing one to start sharing your location with family and friends.
              </Text>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('CreateCircle')}
                  style={styles.button}
                  icon="plus"
                >
                  Create Circle
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('JoinCircle')}
                  style={styles.button}
                  icon="account-plus"
                >
                  Join Circle
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {activeCircle && (
          <Card style={styles.activeCircleCard}>
            <Card.Content>
              <View style={styles.circleHeader}>
                <Text variant="headlineSmall" style={styles.circleName}>
                  {activeCircle.name}
                </Text>
                <Chip icon="people">
                  {activeCircle.members.length} members
                </Chip>
              </View>
              
              <Text variant="bodyMedium" style={styles.inviteCode}>
                Invite Code: {activeCircle.inviteCode}
              </Text>
            </Card.Content>
          </Card>
        )}

        {activeCircle && (
          <Card style={styles.membersCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Circle Members
              </Text>
              
              {activeCircle.members.map((member) => (
                <List.Item
                  key={member.id}
                  title={member.name}
                  description={`Last seen: ${formatLastSeen(member.lastSeen)}`}
                  left={() => (
                    <Avatar.Text
                      size={40}
                      label={member.name.charAt(0).toUpperCase()}
                      style={[
                        styles.avatar,
                        { backgroundColor: member.isOnline ? theme.colors.secondary : theme.colors.onSurfaceVariant }
                      ]}
                    />
                  )}
                  right={() => (
                    <View style={styles.memberStatus}>
                      {member.battery && (
                        <Chip
                          icon={member.battery.isCharging ? 'battery-charging' : 'battery'}
                          style={[
                            styles.batteryChip,
                            { backgroundColor: getBatteryColor(member.battery.level) + '20' }
                          ]}
                          textStyle={{ color: getBatteryColor(member.battery.level) }}
                        >
                          {member.battery.level}%
                        </Chip>
                      )}
                      <View style={[
                        styles.onlineIndicator,
                        { backgroundColor: member.isOnline ? theme.colors.secondary : theme.colors.onSurfaceVariant }
                      ]} />
                    </View>
                  )}
                  style={styles.memberItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {circles.length > 1 && (
          <Card style={styles.otherCirclesCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Other Circles
              </Text>
              
              {circles.filter(circle => circle.id !== activeCircle?.id).map((circle) => (
                <List.Item
                  key={circle.id}
                  title={circle.name}
                  description={`${circle.members.length} members`}
                  left={() => (
                    <Avatar.Icon
                      size={40}
                      icon="people"
                      style={styles.circleAvatar}
                    />
                  )}
                  right={() => (
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => setActiveCircle(circle)}
                    >
                      Switch
                    </Button>
                  )}
                  style={styles.circleItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('CreateCircle')}
            style={styles.actionButton}
            icon="plus"
          >
            Create New Circle
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('JoinCircle')}
            style={styles.actionButton}
            icon="account-plus"
          >
            Join Circle
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyCard: {
    padding: spacing.lg,
  },
  emptyIcon: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: theme.colors.onSurface,
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: theme.colors.onSurfaceVariant,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    marginVertical: spacing.xs,
  },
  activeCircleCard: {
    marginBottom: spacing.md,
  },
  circleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  circleName: {
    color: theme.colors.onSurface,
    flex: 1,
  },
  inviteCode: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  membersCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: theme.colors.onSurface,
  },
  memberItem: {
    paddingVertical: spacing.xs,
  },
  avatar: {
    marginRight: spacing.sm,
  },
  memberStatus: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  batteryChip: {
    height: 24,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  otherCirclesCard: {
    marginBottom: spacing.md,
  },
  circleAvatar: {
    backgroundColor: theme.colors.primaryContainer,
  },
  circleItem: {
    paddingVertical: spacing.xs,
  },
  actionButtons: {
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginVertical: spacing.xs,
  },
});