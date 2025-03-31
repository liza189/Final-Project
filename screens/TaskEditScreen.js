import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../styles/globalStyles";

const TaskEditScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;
  const iconColor = theme === "dark" ? "#fff" : "#6200EE";
  const { task, updateTaskList } = route.params;

  const [taskTitle, setTaskTitle] = useState(task.title);
  const [startDate, setStartDate] = useState(task.startDate);
  const [endDate, setEndDate] = useState(task.endDate);
  const [time, setTime] = useState(task.time || "");
  const [priority, setPriority] = useState(task.priority);
  const [estimatedDuration, setEstimatedDuration] = useState(task.estimatedDuration || "");
  const [description, setDescription] = useState(task.description || "");
  const [subtasks, setSubtasks] = useState(task.subtasks || "");

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const handleStartDateConfirm = (selectedDate) => {
    setStartDate(selectedDate.toDateString());
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);
  const handleEndDateConfirm = (selectedDate) => {
    const selected = new Date(selectedDate);
    const start = new Date(startDate);
    if (selected < start) {
      Alert.alert("Invalid Date", "End date cannot be before start date.");
      return;
    }
    setEndDate(selected.toDateString());
    hideEndDatePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const handleTimeConfirm = (selectedTime) => {
    setTime(selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    hideTimePicker();
  };

  const handleSaveTask = async () => {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedEndDate < parsedStartDate) {
      Alert.alert("Invalid Date", "End date cannot be before start date.");
      return;
    }
    if (!taskTitle || !startDate || !endDate || !priority) {
      Alert.alert("Missing Fields", "Task Title, Start Date, End Date, and Priority are required.");
      return;
    }

    const updatedTask = {
      ...task,
      title: taskTitle,
      startDate,
      endDate,
      priority,
      time,
      subtasks,
      description,
    };

    try {
      const tasksData = await AsyncStorage.getItem("tasks");
      const tasks = tasksData ? JSON.parse(tasksData) : [];
      const taskIndex = tasks.findIndex((t) => t.id === task.id);

      if (taskIndex !== -1) {
        tasks[taskIndex] = updatedTask;
      }

      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      if (typeof updateTaskList === "function") {
        updateTaskList(tasks);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
{/*displaying input fields */}
  return (
    <KeyboardAwareScrollView style={[styles.container, currentTheme.container]}>
      <View style={[styles.inputContainer, currentTheme.inputContainer]}>
        <Ionicons name="document-text-outline" size={20} color={iconColor} style={styles.icon} />
        <TextInput
          style={[styles.input, currentTheme.text]}
          placeholder="Task Title *"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
      </View>
      {/* start date*/}
      <TouchableOpacity onPress={showStartDatePicker} style={[styles.dateInput, currentTheme.inputContainer]}>
        <MaterialIcons name="date-range" size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.dateText, currentTheme.text]}>{startDate || "Select Start Date *"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal isVisible={isStartDatePickerVisible} mode="date" onConfirm={handleStartDateConfirm} onCancel={hideStartDatePicker} />
      {/* end date */}
      <TouchableOpacity onPress={showEndDatePicker} style={[styles.dateInput, currentTheme.inputContainer]}>
        <MaterialIcons name="event" size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.dateText, currentTheme.text]}>{endDate || "Select End Date *"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal isVisible={isEndDatePickerVisible} mode="date" onConfirm={handleEndDateConfirm} onCancel={hideEndDatePicker} />
        {/* priority*/}
      <Text style={[styles.label, currentTheme.text]}>Priority *</Text>
      <View style={styles.priorityContainer}>
        {["Low", "Medium", "High"].map((level) => {
          const isSelected = priority === level;
          const themeSuffix = theme === "dark" ? "Dark" : "Light";
          const buttonStyle = isSelected ? styles[`${level.toLowerCase()}Priority${themeSuffix}`] : styles.priorityButton;
          const textStyle = theme === "dark" ? styles.priorityTextDark : styles.priorityTextLight;

          let iconName = level === "Low" ? "chevron-down" : level === "High" ? "chevron-up" : "chevron-collapse";
          let iconColor = level === "Low" ? "#2ECC71" : level === "Medium" ? "#F39C12" : "#E74C3C";

          return (
            <TouchableOpacity
              key={level}
              style={[styles.priorityButton, isSelected && buttonStyle]}
              onPress={() => setPriority(level)}
            >
              <Ionicons name={iconName} size={20} color={iconColor} style={styles.icon} />
              <Text style={[styles.priorityText, textStyle]}>{level}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
        {/*time */}
      <TouchableOpacity
        onPress={showTimePicker}
        style={[styles.optionalInput, theme === "dark" && styles.darkOptionalInput]}
      >
        <Text style={{ color: theme === "dark" ? "#fff" : "#333" }}>{time || "Select Time"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
      {/*description */}
      <TextInput
        style={[styles.optionalInput, theme === "dark" && styles.darkOptionalInput]}
        placeholder="Description"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
        value={description}
        onChangeText={setDescription}
      />
      {/* subtasks*/}
      <TextInput
        style={[styles.optionalInput, theme === "dark" && styles.darkOptionalInput]}
        placeholder="Subtasks"
        placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
        value={subtasks}
        onChangeText={setSubtasks}
        multiline
      />
    {/*save button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.saveButton, currentTheme.saveButton]} onPress={handleSaveTask}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: { 
    marginRight: 10, 
  },
  input: {  
    fontSize: 18,
    flex: 1, 
    padding: 12,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#807e7e',
   },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: { 
    fontSize: 16
   },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginVertical: 8 
  },
  //priority 
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  priorityButton: {
    alignItems: "center",
    padding: 10,
    borderWidth: 0.7,
    borderRadius: 8,
    width: "30%",
    justifyContent: "center",
    borderColor: "#646465",
  },
  //priority light
  lowPriorityLight: { 
    backgroundColor: "#E8F8F5", 
    borderColor: "#2ECC71" 
  },
  mediumPriorityLight: { 
    backgroundColor: "#FFF3CD", 
    borderColor: "#F39C12" 
  },
  highPriorityLight: { 
    backgroundColor: "#FCE8E8", 
    borderColor: "#E74C3C" 
  },
  //priority dark
  lowPriorityDark: { 
    backgroundColor: "#1F4F43", 
    borderColor: "#2ECC71" 
  },
  mediumPriorityDark: { 
    backgroundColor: "#4A3820", 
    borderColor: "#F39C12" 
  },
  highPriorityDark: { 
    backgroundColor: "#51282D", 
    borderColor: "#E74C3C" 
  },
  priorityTextLight: { 
    color: "#000" 
  },
  priorityTextDark: { 
    color: "#fff" 
  },
  //optional fi;eds
  optionalInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#333",
    height: 60,
    textAlignVertical: "center",
    justifyContent: "center",
  },
  darkOptionalInput: {
    backgroundColor: "#1E181E",
    color: "#fff",
  },
  buttonContainer: { 
    marginTop: 20 
  },
  //save button
  saveButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TaskEditScreen;
