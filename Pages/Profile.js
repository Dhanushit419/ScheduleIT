import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Feather, FontAwesome, Entypo, } from '@expo/vector-icons';
import Iuri from "../assets/sample_profile.jpg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    var name, dept, sem, roll;
    const navigator = useNavigation()
    const [userDetails, setUserDetails] = useState({ name_n: "", sem_n: "" });

    useEffect(() => {
        try {
            async function fetch() {
                const student = JSON.parse(await AsyncStorage.getItem("student"));
                if (student) {
                    name = student.name;
                    dept = student.dept;
                    sem = student.sem;
                    roll = student.roll;
                }
                console.log(name, dept);
                setUserDetails((prev) => {
                    return {
                        name_n: name,
                        dept_n: dept,
                        sem_n: sem,
                        roll_n: roll
                    }
                })
            }
            fetch()
        } catch (err) {
            console.log("ERROR: In Profile.js", err.message)
        }
    }, [])

    const logout = async () => {
        console.log("Logout process")
        try {
            await AsyncStorage.removeItem('student')
            navigator.navigate("Register")
        } catch (err) {
            console.log("ERROR: error in logging out", err.message)
        }
    }

    const confirmLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: logout
                }
            ]
        );
    }

    const reset = async () => {
        console.log("Reset process")
        try {
            await AsyncStorage.clear();
            console.log("Cleared")
            logout()
        } catch (err) {
            console.log("ERROR: error in resetting", err.message)
        }
    }

    const confirmReset = () => {
        Alert.alert(
            "Confirm Reset",
            "All Course & Bunk Datas will be deleted. Are you sure you want to reset?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: reset
                }
            ]
        );
    }

    return (
        <View>
            <View>
                <View style={styles.topContainer}>
                    <View>
                        <Image source={require("../assets/sample_profile.jpg")} style={{ height: 160, width: 150, borderRadius: 100 }} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{userDetails.name_n}</Text>
                        <Text style={styles.dept}>B.Tech {userDetails.dept_n == "IT" ? "Information Technology" : userDetails.dept_n}</Text>
                    </View>
                    <Feather name="edit" size={24} color="black" style={{ position: "absolute", right: 15, top: 15 }} />
                </View>
            </View>
            <View style={styles.midContainer}>
                <TouchableOpacity style={styles.btnBoxes} onPress={() => navigator.navigate("Courses")}>
                    <View style={styles.pressBox} >
                        <MaterialCommunityIcons name="bookshelf" size={34} color="black" />
                        <Text style={styles.boxText}>My Courses</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnBoxes} onPress={() => navigator.navigate("Schedule")} >
                    <View style={styles.pressBox}>
                        <MaterialIcons name="schedule" size={34} color="black" />
                        <Text style={styles.boxText}>Schedule</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnBoxes} onPress={() => navigator.navigate("Cgpa")}>
                    <View style={styles.pressBox}>
                        <MaterialCommunityIcons name="book-education-outline" size={34} color="black" />
                        <Text style={styles.boxText}>CGPA Manager</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnBoxes} onPress={() => navigator.navigate("BunkManager")}>
                    <View style={styles.pressBox}>
                        <FontAwesome name="hand-stop-o" size={34} color="black" />
                        <Text style={styles.boxText}>Bunk Manager</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnBoxes} onPress={confirmReset}>
                    <View style={styles.pressBox} >
                        <MaterialCommunityIcons name="rotate-3d-variant" size={34} color="red" />
                        <Text style={styles.boxText}>Reset</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnBoxes} onPress={confirmLogout}>
                    <View style={styles.pressBox}>
                        <MaterialIcons name="logout" size={34} color="red" />
                        <Text style={styles.boxText}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = {
    boxText: {
        textAlign: "center",
        fontSize: 13,
        fontWeight: 400
    },
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        fontSize: 30
    },
    dept: {
        fontSize: 15
    },
    textContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    topContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
        padding: 20,
        backgroundColor: "#F2EFE5",
        borderRadius: 20,
        elevation: 10,
    },
    btnBoxes: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
        padding: 20,
        backgroundColor: "#F2EFE5",
        borderRadius: 20,
        elevation: 10,
        flexBasis: "39%",
    },
    pressBox: {
        justifyContent: "center",
        alignItems: "center",
    },
    midContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
}

export default Profile