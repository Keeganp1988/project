import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1e3a8a', // Navy Blue
    primaryContainer: '#dbeafe',
    secondary: '#10b981', // Soft Green
    secondaryContainer: '#d1fae5',
    tertiary: '#f59e0b', // Amber for alerts
    tertiaryContainer: '#fef3c7',
    error: '#dc2626', // Red for emergencies
    errorContainer: '#fee2e2',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',
    outline: '#e2e8f0',
    background: '#f8fafc',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      fontFamily: 'Inter',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};