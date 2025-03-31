import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import { getTasks, deleteTask } from '../services/taskService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );
{/*loading saved tasks */}
  const loadTasks = async () => {
    try {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks.filter((task) => !task.completed));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };
{/* a function for task deletion*/}
  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              loadTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          },
        },
      ]
    );
  };
{/* a function for completing a task*/}
  const handleCompleteTask = async (taskId) => {
    Alert.alert(
      'Complete Task',
      'Mark this task as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const tasks = await getTasks();
              const updatedTasks = tasks.map((task) =>
                task.id === taskId ? { ...task, completed: true } : task
              );
              await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
              loadTasks();
            } catch (error) {
              console.error('Error completing task:', error);
            }
          },
        },
      ]
    );
  };
{/* task card */}
  const renderTaskItem = ({ item }) => {
    const priorityColor = item.priority === 'Low' ? '#2ECC71' : item.priority === 'Medium' ? '#F39C12' : '#E74C3C';

{/* swiping to delete and complete task */}
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#E74C3C' }]} onPress={() => handleDeleteTask(item.id)}>
            <Ionicons name="trash-outline" size={24} color='#fff' />
          </TouchableOpacity>
        )}
        
        renderLeftActions={() => (
          <TouchableOpacity style={[styles.completeButton, { backgroundColor: '#2ECC71' }]} onPress={() => handleCompleteTask(item.id)}>
            <Ionicons name="checkmark-done-outline" size={24} color='#fff' />
          </TouchableOpacity>
        )}
      >
        <View style={[styles.taskItem, 
        {borderLeftColor: priorityColor, 
        borderLeftWidth: 8, 
        borderColor: priorityColor, 
        borderWidth: theme === 'dark' ? 1 : 0, 
        backgroundColor: theme === 'dark' ? '#333' : (item.priority === 'Low' ? '#E8F8F5' : item.priority === 'Medium' ? '#FFF3CD' : '#FCE8E8') }]}> 
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskDetailsScreen', { task: item })}
            style={{ flex: 1 }}
          >
            <Text style={[styles.taskTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.title}</Text>
            <Text style={[styles.taskDates, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.startDate} - {item.endDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TaskEditScreen', { task: item })}>
          <Ionicons name="pencil-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />

          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };
{/* displaying task list*/}
  return (
    <View style={[styles.container, currentTheme.container]}> 
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTaskItem}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#6200EE' }]}
        onPress={() => navigation.navigate('TaskCreationScreen')}
      >
        <Ionicons name="add-outline" size={32} color='#fff' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 68,
    borderRadius: 8,
  },
  completeButton: {
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 68,
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDates: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    padding: 15,
    borderRadius: 50,
  },
});

export default HomeScreen;





