import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../styles/globalStyles";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();  
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;
  console.log("Current theme in SettingsScreen:", theme);  

  return (
    <View style={[styles.container, currentTheme.container]}>

      {/* dark mode toggle */}
      <View style={[styles.settingRow, currentTheme.settingRow]}>
        <Ionicons name="moon-outline" style={styles.icon} size={24} color={theme === "dark" ? "#fff" : "#6200EE"} />
        <Text style={[styles.settingText, currentTheme.text]}>Dark Mode</Text>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#6200EE" }}
          thumbColor={theme === "dark" ? "#f4f3f4" : "#f4f3f4"}
          style={styles.switch}
        />
      </View>

      {/* notifications toggle */}
      <View style={[styles.settingRow, currentTheme.settingRow]}>
        <Ionicons name="notifications-outline" style={styles.icon} size={24} color={theme === "dark" ? "#fff" : "#6200EE"} />
        <Text style={[styles.settingText, currentTheme.text]}>Enable Notifications</Text>
        <Switch
          value={true}  
          onValueChange={() => {}}
          trackColor={{ false: "#767577", true: "#6200EE" }}
          thumbColor={theme === "dark" ? "#f4f3f4" : "#f4f3f4"}
          style={styles.switch}
        />
      </View>

      {/* autosync toggle */}
      <View style={[styles.settingRow, currentTheme.settingRow]}>
        <Ionicons name="cloud-upload-outline" style={styles.icon} size={24} color={theme === "dark" ? "#fff" : "#6200EE"} />
        <Text style={[styles.settingText, currentTheme.text]}>Auto Sync</Text>
        <Switch
          value={false}  
          onValueChange={() => {}}
          trackColor={{ false: "#767577", true: "#6200EE" }}
          thumbColor={theme === "dark" ? "#f4f3f4" : "#f4f3f4"}
          style={styles.switch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.2,
    borderBottomColor: "#ddd",
    marginBottom: 15,
    borderRadius: 8,
    
  },
  settingText: {
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginLeft: 20,
  },
  switch: {
    marginRight: 15,
  },

});

export default SettingsScreen;
