import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = "tasks";
{/*retrieves tasks from storage */} 
export const getTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const parsed = storedTasks ? JSON.parse(storedTasks) : [];
  
      {/*filter tasks */}
      return parsed.filter(task =>
        task &&
        typeof task.title === 'string' &&
        typeof task.completed === 'boolean' &&
        typeof task.priority === 'string'
      );
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  };
  
{/* save tasks */}
export const saveTasks = async (tasks) => {
    try {
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks:", error);
    }
};

{/* add a new task and save it*/}
export const addTask = async (newTask) => {
    try {
        let tasks = await getTasks();
        tasks.push(newTask);
        await saveTasks(tasks);
    } catch (error) {
        console.error("Error adding task:", error);
    }
};

{/* delete a task*/}
export const deleteTask = async (taskId) => {
    try {
        let tasks = await getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        await saveTasks(tasks);
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

{/*  mark a task as completed and save it*/}
export const completeTask = async (taskId) => {
    try {
        let tasks = await getTasks();
        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        await saveTasks(tasks);
        console.log(`Task with ID ${taskId} marked as completed`);
    } catch (error) {
        console.error("Error marking task as completed:", error);
    }
};
