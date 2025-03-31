import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../styles/globalStyles";

const TaskDetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;
  const { task } = route.params;
  const iconColor = theme === "dark" ? "#fff" : "#6200EE";

{/* displaying task information*/}
  return (
    <View style={[styles.container, currentTheme.container]}>
      {/* title*/}
      <View style={styles.titleContainer}>
        <Ionicons name="document-text-outline" size={26} color={iconColor} />
        <Text style={[styles.title, currentTheme.text]}>{task.title}</Text>
      </View>

      {/* priority  */}
      <View style={[styles.priorityTag, getPriorityStyle(task.priority)]}>
        <Text style={styles.priorityText}>{task.priority} Priority</Text>
      </View>

      {/* start date*/}
      <View style={[styles.card, currentTheme.inputContainer]}>
        <MaterialIcons name="date-range" size={20} color={iconColor}  />
        <Text style={[styles.detail, currentTheme.text]}>
          <Text style={styles.bold}>Start Date:</Text> {task.startDate}
        </Text>
      </View>
      {/* end date*/}
      <View style={[styles.card, currentTheme.inputContainer]}>
        <MaterialIcons name="event" size={20} color={iconColor}  />
        <Text style={[styles.detail, currentTheme.text]}>
          <Text style={styles.bold}>End Date:</Text> {task.endDate}
        </Text>
      </View>
      {/*time */}
      {task.time && (
        <View style={[styles.card, currentTheme.inputContainer]}>
          <Ionicons name="time-outline" size={20} color={iconColor}  />
          <Text style={[styles.detail, currentTheme.text]}>
            <Text style={styles.bold}>Time:</Text> {task.time}
          </Text>
        </View>
      )}
        {/* subtasks*/}

      {task.subtasks && (
        <View style={[styles.card, currentTheme.inputContainer]}>
          <FontAwesome5 name="tasks" size={18} color={iconColor} />
          <Text style={[styles.detail, currentTheme.text]}>
            <Text style={styles.bold}>Subtasks:</Text> {task.subtasks}
          </Text>
        </View>
      )}
        {/* description*/}
      {task.description && (
        <View style={[styles.card, currentTheme.inputContainer]}>
          <Ionicons name="information-circle-outline" size={20} color={iconColor}  />
          <Text style={[styles.detail, currentTheme.text]}>
            <Text style={styles.bold}>Description:</Text> {task.description}
          </Text>
        </View>
      )}

      {/* go back button */}
      <TouchableOpacity style={[styles.backButton, currentTheme.saveButton]} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// hlper function to style priority tags
const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":
      return { backgroundColor: "#E74C3C" };
    case "Medium":
      return { backgroundColor: "#F39C12" };
    case "Low":
      return { backgroundColor: "#2ECC71" };
    default:
      return { backgroundColor: "#bbb" };
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#807e7e',
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginLeft: 10,
  },
  bold: {
    fontWeight: "bold",
  },

  //priority tags
  priorityTag: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: 18,
  },
  priorityText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  //backbutton
  backButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default TaskDetailsScreen;
