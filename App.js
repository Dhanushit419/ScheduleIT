import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import CGPA from './Pages/Cgpa';
import Courses from './Pages/Courses';
import AddCourse from './Pages/AddCourse';
import BunkManager from './Pages/BunkManager';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: () => (<Ionicons name="analytics" size={20} />),
          headerShown: true,
          headerTitle: "Dashboard"
        }}
      />
      <Tab.Screen name="Profile" component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => (<Ionicons name="person" size={20} />),
          headerShown: true,
          headerTitle: "Profile"
        }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      const student = await AsyncStorage.getItem('student');
      if (student) {
        setIsRegistered(true);
      }
    };
    checkRegistration();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isRegistered ? "MainTabs" : "Register"}>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Cgpa" component={CGPA} />
        <Stack.Screen name="Courses" component={Courses} />
        <Stack.Screen name="AddCourses" component={AddCourse} />
        <Stack.Screen name="BunkManager" component={BunkManager} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
