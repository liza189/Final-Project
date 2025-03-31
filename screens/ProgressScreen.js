import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../styles/globalStyles';
import { getTasks } from '../services/taskService';
import { useFocusEffect } from '@react-navigation/native';
import { useMemo } from 'react';

const screenWidth = Dimensions.get('window').width;
const clamp = (val, min = 0, max = 1) => {
  if (isNaN(val)) return 0;
  return Math.max(min, Math.min(max, val));
};


const ProgressScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentTheme = isDark ? darkTheme : lightTheme;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [monthlyCompletedTasks, setMonthlyCompletedTasks] = useState(0);
  const [priorityStats, setPriorityStats] = useState({ Low: 0, Medium: 0, High: 0 });

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, [])
  );
{/*extract month for stat badges */}
  const getMonthFromDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${month}-${year}`;
  };
{/*for tasks completed this month */}
  const getCurrentMonth = () => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  };

  const countMonthlyCompletedTasks = (completedTasks) => {
    const currentMonth = getCurrentMonth();
    return completedTasks.filter((task) => getMonthFromDate(task.endDate) === currentMonth).length;
  };
{/*completed tasks loading for stats*/}
  const loadCompletedTasks = async () => {
    try {
      const parsedTasks = await getTasks();
      const completed = parsedTasks.filter((task) => task.completed === true);

      const priorityCount = { Low: 0, Medium: 0, High: 0 };
      completed.forEach((task) => {
        if (task.priority && priorityCount.hasOwnProperty(task.priority)) {
          priorityCount[task.priority] += 1;
        }
      });

      const monthlyCompleted = countMonthlyCompletedTasks(completed);

      setCompletedTasks(completed);
      setTotalTasks(parsedTasks.length);
      setMonthlyCompletedTasks(monthlyCompleted);
      setPriorityStats(priorityCount);
    } catch (error) {
      console.error(' Error loading completed tasks:', error);
    }
  };

{/*pie chart*/}
  const pieData = Object.entries(priorityStats)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => {
      const colors = {
        Low: '#2ECC71',
        Medium: '#F39C12',
        High: '#E74C3C',
      };
      return {
        name: key,
        population: value,
        color: colors[key],
        legendFontColor: isDark ? '#fff' : '#333',
        legendFontSize: 15,
      };
    });

      
  return (
    <View style={[styles.container, { backgroundColor: currentTheme.container.backgroundColor }]}> 
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>Tasks Completed:</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statBadge, { backgroundColor: isDark ? '#2B2139' : '#f5f0f5' }]}> 
          <Text style={[styles.badgeText, { color: isDark ? '#fff' : '#000' }]}>Total:</Text>
          <Text style={[styles.numberText, { color: isDark ? '#fff' : '#000' }]}>{completedTasks.length}</Text>
        </View>
        <View style={[styles.statBadge, { backgroundColor: isDark ? '#2B2139' : '#f5f0f5' }]}> 
          <Text style={[styles.badgeText, { color: isDark ? '#fff' : '#000' }]}>This Month:</Text>
          <Text style={[styles.numberText, { color: isDark ? '#fff' : '#000' }]}>{monthlyCompletedTasks}</Text>
        </View>
      </View>

      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>Task Breakdown by Priority: </Text>
      <View style={styles.chartContainer}>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth * 0.6}
            height={200}
            chartConfig={{
              backgroundColor: currentTheme.container.backgroundColor,
              backgroundGradientFrom: currentTheme.container.backgroundColor,
              backgroundGradientTo: currentTheme.container.backgroundColor,
              color: () => isDark ? '#fff' : '#000',
              labelColor: () => isDark ? '#fff' : '#000',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="50"
            absolute
            hasLegend={false}
          />
        ) : (
          <Text style={{ color: isDark ? '#fff' : '#000', marginTop: 20 }}>No data to display</Text>
        )}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#2ECC71' }]} />
            <Text style={[styles.legendText, { color: isDark ? '#fff' : '#000' }]}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F39C12' }]} />
            <Text style={[styles.legendText, { color: isDark ? '#fff' : '#000' }]}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#E74C3C' }]} />
            <Text style={[styles.legendText, { color: isDark ? '#fff' : '#000' }]}>High</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
    marginVertical: 15,
  },
  percentageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#6200EE',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  legendContainer: {
    marginRight: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 80,
    marginTop: 22,
  },
  sectionLabel:{
    marginTop: 40, 
    marginBottom: 8,
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '400'
  },
  statBadge: {
    width: screenWidth / 3,
    borderRadius: 12,
    paddingVertical: 18,
    backgroundColor: '#D2B2FF',
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8c4fe3',
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  numberText:{
    color: '#000',
    fontWeight: 'bold',
    fontSize: 30,
  }
});

export default ProgressScreen;
