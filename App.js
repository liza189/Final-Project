import 'react-native-gesture-handler';
import 'react-native-reanimated'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppTabs from './navigation/AppNavigator';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}
