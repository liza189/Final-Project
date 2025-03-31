import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

function MainNavigator() {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? '#333' : '#6200EE';
  const textColor = theme === 'dark' ? '#fff' : '#fff';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: backgroundColor,
        },
        tabBarActiveTintColor: textColor,
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
