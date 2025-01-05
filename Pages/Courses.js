import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const CoursesDisplay = () => {
    const navigate = useNavigation();

    const [theoryCourses, setTheoryCourses] = useState([]);
    const [labCourses, setLabCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noCourses, setNoCourses] = useState(false);

    const GetCourses = async () => {
        console.log("get courses");
        try {
            const data = await AsyncStorage.getItem("classData");
            if (data) {
                const parsedData = JSON.parse(data);
                console.log(parsedData);
                const theoryCourses = parsedData.filter((course) => course.type === "Theory");
                const labCourses = parsedData.filter((course) => course.type === "Lab");
                setTheoryCourses(theoryCourses);
                setLabCourses(labCourses);
                setLoading(false);
            } else {
                setNoCourses(true);
                setLoading(false);
            }
        } catch (err) {
            console.log("Error in fetching courses", err.message);
        }
    };

    const confirmDelete = (courseName) => {
        Alert.alert(
            "Delete Course",
            "Are you sure you want to delete this course?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => deleteCourse(courseName)
                }
            ],
            { cancelable: false }
        );
    };

    const deleteCourse = async (courseName) => {
        try {
            const data = await AsyncStorage.getItem("classData");
            if (data) {
                const parsedData = JSON.parse(data);
                const updatedData = parsedData.filter((course) => course.courseName !== courseName);
                await AsyncStorage.setItem("classData", JSON.stringify(updatedData));
                GetCourses();
            }
        } catch (err) {
            console.log("Error in deleting course", err.message);
        }
    };

    useEffect(() => {
        GetCourses();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigate.navigate('MainTabs', { screen: 'Profile' });
            return () => backHandler.remove()
        });

        return () => backHandler.remove(); // Clean up on unmount
    }, [navigate]);

    useFocusEffect(
        React.useCallback(() => {
            GetCourses();
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <View style={styles.sectionHead}>
                        <Text style={styles.headText}>Theory Courses</Text>
                    </View>
                    <View style={styles.sectionBody}>
                        {loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text>Loading...</Text>
                            </View>
                        ) : noCourses ? (
                            <Text style={{ flex: 1, textAlign: "center" }}>* Please add a Course</Text>
                        ) : (
                            theoryCourses.map((course, ind) => (
                                <View style={styles.courseBox} key={ind}>
                                    <Text style={styles.courseText}>{course.courseName}</Text>
                                    <View style={styles.courseRow}>
                                        <Text style={styles.facultyText}>{course.faculty}</Text>
                                        <Pressable onPress={() => confirmDelete(course.courseName)}>
                                            <MaterialIcons name="delete" size={24} color="grey" />
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHead}>
                        <Text style={styles.headText}>Laboratory Courses</Text>
                    </View>
                    <View style={styles.sectionBody}>
                        {loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text>Loading...</Text>
                            </View>
                        ) : noCourses ? (
                            <Text style={{ flex: 1, textAlign: "center" }}>* Please add a Course</Text>
                        ) : (
                            labCourses.map((course, ind) => (
                                <View style={styles.courseBox} key={100 + ind}>
                                    <Text style={styles.courseText}>{course.courseName}</Text>
                                    <View style={styles.courseRow}>
                                        <Text style={styles.facultyText}>{course.faculty}</Text>
                                        <Pressable onPress={() => confirmDelete(course.courseName)}>
                                            <MaterialIcons name="delete" size={24} color="grey" />
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>
                <View style={{ height: 20 }}></View>
            </ScrollView>
            <Pressable
                onPress={() => {
                    console.log("pressed");
                    navigate.navigate("AddCourses");
                }}
                style={styles.buttonBox}
            >
                <Ionicons name="add" size={45} color="white" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 5,
    },
    section: {},
    sectionHead: {
        margin: 13,
    },
    headText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    sectionBody: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 13,
        rowGap: 13,
        justifyContent: "center",
        margin: "auto",
        marginLeft: 13,
    },
    courseBox: {
        padding: 25,
        backgroundColor: "#F2EFE5",
        borderRadius: 15,
        flexBasis: "45%",
        elevation: 10,
    },
    courseText: {
        fontSize: 17,
        fontWeight: "500",
    },
    courseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    facultyText: {
        fontSize: 15,
        fontWeight: "400",
    },
    buttonBox: {
        position: "absolute",
        bottom: 20,
        right: 30,
        backgroundColor: "green",
        borderRadius: 10,
        padding: 7,
        marginBottom: 20,
    },
});

export default CoursesDisplay;