import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const TaskCard = ({ task, onDelete, onEdit }) => {
  const priorityColor =
    task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green";

  return (
    <View style={[styles.card, { borderColor: priorityColor }]}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>{task.description}</Text>
        <Text style={{ color: priorityColor }}>Priority: {task.priority}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: { 
    flex: 1 
  },
  title: { 
    fontWeight: "bold", 
    fontSize: 16 
  },
  buttons: { 
    flexDirection: "row" 
  },
  editButton: { 
    backgroundColor: "#6782f0", 
    padding: 10, 
    borderRadius: 5, 
    marginRight: 5 
  },
  deleteButton: {
     backgroundColor: "#ed6666", 
     padding: 10, 
     borderRadius: 5 
    },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default TaskCard;
