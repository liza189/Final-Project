import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../styles/globalStyles";

const TaskCreationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentTheme = isDark ? darkTheme : lightTheme;
  const iconColor = theme === "dark" ? "#fff" : "#6200EE";

  const [taskTitle, setTaskTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState("");

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showSubtasksInput, setShowSubtasksInput] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0]; // ISO format (YYYY-MM-DD)

  const formatDisplayDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) =>
    time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const handleStartDateConfirm = (selectedDate) => {
    if (!selectedDate || !(selectedDate instanceof Date)) {
      Alert.alert("Invalid Date", "Please select a valid start date.");
      return;
    }
    if (endDate && selectedDate > endDate) {
      Alert.alert("Invalid Date", "Start date cannot be after end date.");
      return;
    }
    setStartDate(selectedDate);
    hideStartDatePicker();
  };

  {/*validating start/end date */}
  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);
  const handleEndDateConfirm = (selectedDate) => {
    if (!selectedDate || !(selectedDate instanceof Date)) {
      Alert.alert("Invalid Date", "Please select a valid end date.");
      return;
    }
    if (startDate && selectedDate < startDate) {
      Alert.alert("Invalid Date", "End date cannot be before start date.");
      return;
    }
    setEndDate(selectedDate);
    hideEndDatePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const handleTimeConfirm = (selectedTime) => {
    setTime(formatTime(selectedTime));
    hideTimePicker();
  };

  const handleSaveTask = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Missing Dates", "Please select both start and end dates.");
      return;
    }

    if (!taskTitle || !priority) {
      Alert.alert("Missing Fields", "Task Title and Priority are required.");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      startDate: startDate ? formatDate(startDate) : "",
      endDate: endDate ? formatDate(endDate) : "",
      priority,
      time,
      subtasks,
      description,
      completed: false,
    };

    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      navigation.goBack();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <KeyboardAwareScrollView style={[styles.container, currentTheme.container]}>
      {/* task title */}
      <View style={[styles.inputContainer, currentTheme.inputContainer]}>
        <Ionicons name="document-text-outline" size={20} color={iconColor} style={styles.icon} />
        <TextInput
          style={[styles.input, currentTheme.text]}
          placeholder="Task Title *"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#000"}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
      </View>

      {/* start date */}
      <TouchableOpacity onPress={showStartDatePicker} style={[currentTheme.inputContainer, styles.dateInput]}>
        <MaterialIcons name="date-range" size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.dateText, currentTheme.text]}>
          {startDate ? formatDisplayDate(startDate) : "Select Start Date *"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal isVisible={isStartDatePickerVisible} mode="date" onConfirm={handleStartDateConfirm} onCancel={hideStartDatePicker} />

      {/* end date */}
      <TouchableOpacity onPress={showEndDatePicker} style={[styles.dateInput, currentTheme.inputContainer]}>
        <MaterialIcons name="event" size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.dateText, currentTheme.text]}>
          {endDate ? formatDisplayDate(endDate) : "Select End Date *"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal isVisible={isEndDatePickerVisible} mode="date" onConfirm={handleEndDateConfirm} onCancel={hideEndDatePicker} />

      {/* priority */}
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>
        Priority *
      </Text>
      <View style={styles.priorityContainer}>
        {["Low", "Medium", "High"].map((level) => {
          const isSelected = priority === level;
          const themeSuffix = isDark ? "Dark" : "Light";
          const buttonStyle = isSelected
            ? styles[`${level.toLowerCase()}Priority${themeSuffix}`]
            : styles.priorityButton;
          const textStyle = isDark ? styles.priorityTextDark : styles.priorityTextLight;

          let iconName, iconColor;
          switch (level) {
            case "Low": iconName = "chevron-down"; iconColor = "#2ECC71"; break;
            case "Medium": iconName = "chevron-collapse"; iconColor = "#F39C12"; break;
            case "High": iconName = "chevron-up"; iconColor = "#E74C3C"; break;
          }

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

      {/* toggle time */}
      <TouchableOpacity onPress={() => setShowTimeInput(!showTimeInput)} style={[styles.toggleButton, isDark && styles.darkToggleButton]}>
        <Text style={[styles.toggleButtonText, isDark && styles.darkToggleButtonText]}>
          {showTimeInput ? "Hide Time" : "Add Time"}
        </Text>
      </TouchableOpacity>
      {showTimeInput && (
        <>
          <TouchableOpacity onPress={showTimePicker} style={[styles.expandableContent, isDark && styles.darkExpandableContent]}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 16 }}>
              {time || "Select Time"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleTimeConfirm} onCancel={hideTimePicker} />
        </>
      )}

      {/* toggle description */}
      <TouchableOpacity onPress={() => setShowDescriptionInput(!showDescriptionInput)} style={[styles.toggleButton, isDark && styles.darkToggleButton]}>
        <Text style={[styles.toggleButtonText, isDark && styles.darkToggleButtonText]}>
          {showDescriptionInput ? "Hide Description" : "Add Description"}
        </Text>
      </TouchableOpacity>
      {showDescriptionInput && (
        <TextInput
          style={[styles.optionalInput, isDark && styles.darkOptionalInput]}
          placeholder="Enter Description"
          placeholderTextColor={isDark ? "#aaa" : "#777"}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      )}

      {/* Togglt subtasks */}
      <TouchableOpacity onPress={() => setShowSubtasksInput(!showSubtasksInput)} style={[styles.toggleButton, isDark && styles.darkToggleButton]}>
        <Text style={[styles.toggleButtonText, isDark && styles.darkToggleButtonText]}>
          {showSubtasksInput ? "Hide Subtasks" : "Add Subtasks"}
        </Text>
      </TouchableOpacity>
      {showSubtasksInput && (
        <TextInput
          style={[styles.optionalInput, isDark && styles.darkOptionalInput]}
          placeholder="Enter Subtasks"
          placeholderTextColor={isDark ? "#aaa" : "#777"}
          value={subtasks}
          onChangeText={setSubtasks}
          multiline
        />
      )}

      {/* save button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
        <Text style={styles.saveButtonText}>Save Task</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

//input fields
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#807e7e',
  },
icon: {
  marginRight: 8
},
//date and time pickers
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },

//priority container
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
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
  priorityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  labelLight: {
    color: "#000",
  },
  labelDark: {
    color: "#fff",
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

// toggle buttons for optional fields
  toggleButton: {
    backgroundColor: "#f0f0f5",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkToggleButton: {
    backgroundColor: "#2B2139",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#6200EE",
    fontWeight: "bold",
  },
  darkToggleButtonText: {
    color: "#fff",
  },

//expanded sections
  expandableContent: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  darkExpandableContent: {
    backgroundColor: "#1E181E",
    color: "#333",
  },

  //optional fields 
  optionalInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#333",
    height: 60,
    fontSize: 16,
    textAlignVertical: "top",
  },
  darkOptionalInput: {
    backgroundColor: "#1E181E",
    color: "#fff",
  },
//save button
  saveButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TaskCreationScreen;