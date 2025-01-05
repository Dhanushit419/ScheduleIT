import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import CGPA from './Pages/Cgpa';
import Courses from './Pages/Courses';
import AddCourse from './Pages/AddCourse';
import BunkManager from './Pages/BunkManager';
import Schedule from './Pages/Schedule';
import AboutDevelopers from './Pages/About';
import FAQPage from './Pages/Faq';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// MainTabs component to show the bottom tabs
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: () => <Ionicons name="analytics" size={20} />,
          headerShown: true,
          headerTitle: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Ionicons name="person" size={20} />,
          headerShown: true,
          headerTitle: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isRegistered, setIsRegistered] = useState(null); // Initial state set to null for loading
  const [loading, setLoading] = useState(true); // Loading state

  // Check if user is registered
  useEffect(() => {
    const checkRegistration = async () => {
      const student = await AsyncStorage.getItem('student');
      if (student) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
      setLoading(false); // Set loading to false once the check is complete
    };
    checkRegistration();
  }, []);

  // Show loading animation while checking registration
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isRegistered ? "MainTabs" : "Register"}>
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerLeft: null }} // Disable back button
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Cgpa" component={CGPA} />
        <Stack.Screen name="Courses" component={Courses} />
        <Stack.Screen name="AddCourses" component={AddCourse} />
        <Stack.Screen name="BunkManager" component={BunkManager} />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="About" component={AboutDevelopers} />
        <Stack.Screen name="FAQ" component={FAQPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
