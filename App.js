import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import CGPA from './Pages/Cgpa';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Profile" component={Profile} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
