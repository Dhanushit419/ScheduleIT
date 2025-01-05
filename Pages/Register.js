import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const [userDetails, setUserDetails] = useState({
        roll: "",
        name: "",
        dept: "",
        sem: "",
    });
    const [error, setError] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem('student');
            const storedSchedule = await AsyncStorage.getItem('schedule');
            if (storedUser && storedSchedule) {
                console.log(storedSchedule)
                navigation.replace('MainTabs');
            }
        };
        checkUser();

        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const validateForm = () => {
        let errors = {};
        if (!userDetails.roll) errors.roll = "Please enter your roll number.";
        if (!userDetails.name) errors.name = "Please enter your name.";
        if (!userDetails.dept) errors.dept = "Please enter your department.";
        if (!userDetails.sem) errors.sem = "Please enter your sem.";
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field, value) => {
        setUserDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await AsyncStorage.setItem('student', JSON.stringify(userDetails));
                Alert.alert("Success", "Registration successful!");
                const storedSchedule = await AsyncStorage.getItem('schedule');
                if (!storedSchedule) {
                    const schedule = Array.from({ length: 7 }, () => Array(8).fill(-1));
                    await AsyncStorage.setItem('schedule', JSON.stringify(schedule));
                }

                const storedCgpa = await AsyncStorage.getItem('cgpa');
                if (!storedCgpa) {
                    const cgpa = Array(8).fill(0);
                    await AsyncStorage.setItem('cgpa', JSON.stringify(cgpa));
                }
                navigation.replace('MainTabs');
            } catch (error) {
                Alert.alert("Error", "Failed to save data.");
                console.error(error);
            }
        } else {
            Alert.alert("Error", "Please fill all fields correctly.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.form}>
                <TextInput
                    value={userDetails.roll}
                    onChangeText={(value) => handleChange("roll", value)}
                    placeholder="Roll Number"
                    style={styles.input}
                />
                {error.roll && <Text style={styles.error}>{error.roll}</Text>}

                <TextInput
                    value={userDetails.name}
                    onChangeText={(value) => handleChange("name", value)}
                    placeholder="Name"
                    style={styles.input}
                />
                {error.name && <Text style={styles.error}>{error.name}</Text>}

                <TextInput
                    value={userDetails.dept}
                    onChangeText={(value) => handleChange("dept", value)}
                    placeholder="Department"
                    style={styles.input}
                />
                {error.dept && <Text style={styles.error}>{error.dept}</Text>}

                <TextInput
                    value={userDetails.sem}
                    onChangeText={(value) => handleChange("sem", value)}
                    placeholder="sem"
                    style={styles.input}
                />
                {error.sem && <Text style={styles.error}>{error.sem}</Text>}

                <Button title="Sign Up" onPress={handleSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#164863',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#fff",
    },
    form: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        width: "80%",
        elevation: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default Register;
