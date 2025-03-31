import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

//screens import 
import HomeScreen from "../screens/HomeScreen";
import TaskCreationScreen from "../screens/TaskCreationScreen";
import TaskEditScreen from "../screens/TaskEditScreen";
import TaskDetailsScreen from "../screens/TaskDetailsScreen";
import ProgressScreen from "../screens/ProgressScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// stack navigator for task screens
const TaskStack = () => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "#1F181F" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#6200EE";

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Task Manager" }}
      />
      <Stack.Screen
        name="TaskCreationScreen"
        component={TaskCreationScreen}
        options={{ title: "Create Task" }}
      />
      <Stack.Screen
        name="TaskEditScreen"
        component={TaskEditScreen}
        options={{ title: "Edit Task" }}
      />
      <Stack.Screen
        name="TaskDetailsScreen"
        component={TaskDetailsScreen}
        options={{ title: "Task Details" }}
      />
    </Stack.Navigator>
  );
};

// stack navigator for progress dcreen
const ProgressStack = () => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "#1F181F" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#6200EE";

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ProgressScreen"   
        component={ProgressScreen}
        options={{ title: "Progress" }}
      />
    </Stack.Navigator>
  );
};


// stack navigator for settings 
const SettingsStack = () => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "#1F181F" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#6200EE";

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="SettingsScreen"   
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
};


// bottom tab navigator
const AppTabs = () => {
  const { theme } = useTheme();
  const backgroundColor = theme === "dark" ? "#1F181F" : "#fff";
  const activeColor = theme === "dark" ? "#D2B2FF" : "#6200EE";
  const inactiveColor = theme === "dark" ? "#fff" : "gray";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Tasks") iconName = "list-outline";
          else if (route.name === "Progress") iconName = "stats-chart-outline";
          else if (route.name === "Settings") iconName = "settings-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          paddingBottom: 10,
          height: 80,
          borderRadius: 20,
          borderColor: backgroundColor,
          position: "absolute",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
        name="Tasks"
        component={TaskStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};


export default AppTabs;
