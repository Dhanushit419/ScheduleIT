import { View, Text, Image, Modal, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
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
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [newName, setNewName] = useState("");

    const handleSaveName = async () => {
        try {
            const student = JSON.parse(await AsyncStorage.getItem("student"));
            if (student) {
                student.name = newName;
                await AsyncStorage.setItem("student", JSON.stringify(student));
                setUserDetails((prev) => ({
                    ...prev,
                    name_n: newName
                }));
            }
            setEditDialogVisible(false);

            navigator.navigate("Dashboard");
        } catch (err) {
            console.log("ERROR: error in saving name", err.message);
        }
    };

    return (
        <ScrollView>
            <View>
                <View style={styles.topContainer}>
                    <View>
                        <Image source={require("../assets/sample_profile.jpg")} style={{ height: 160, width: 150, borderRadius: 100 }} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{userDetails.name_n}</Text>
                        <Text style={styles.dept}>B.Tech {userDetails.dept_n == "IT" ? "Information Technology" : userDetails.dept_n}</Text>
                    </View>
                    <TouchableOpacity style={{ position: "absolute", right: 15, top: 15 }} onPress={() => setEditDialogVisible(true)}>
                        <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editDialogVisible}
                    onRequestClose={() => setEditDialogVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                        }}
                    >
                        <View
                            style={{
                                margin: 20,
                                backgroundColor: "white",
                                borderRadius: 15,
                                padding: 30,
                                alignItems: "center",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                                width: 300,
                            }}
                        >
                            <Text
                                style={{
                                    marginBottom: 20,
                                    textAlign: "center",
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "#333",
                                }}
                            >
                                Edit Name
                            </Text>
                            <TextInput
                                style={{
                                    height: 40,
                                    borderColor: "#ccc",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    marginBottom: 20,
                                    width: "100%",
                                    paddingLeft: 10,
                                    backgroundColor: "#f9f9f9",
                                }}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Enter new name"
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    width: "100%",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#2196F3",
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => setEditDialogVisible(false)}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#2196F3",
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 5,
                                    }}
                                    onPress={handleSaveName}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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
        </ScrollView>
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