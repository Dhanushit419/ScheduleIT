import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Alert, Modal, TextInput } from 'react-native'
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
    const [modalVisible, setModalVisible] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({});

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
            console.log("course to deleted :", courseName)
            const data = await AsyncStorage.getItem("classData");
            if (data) {
                const parsedData = JSON.parse(data);

                const CourseNo = parsedData.find((course) => course.courseName === courseName).CourseNo;
                const updatedData = parsedData.filter((course) => course.courseName !== courseName);
                await AsyncStorage.setItem("classData", JSON.stringify(updatedData));
                const scheduleData = await AsyncStorage.getItem("schedule");
                console.log("Course num : ", CourseNo)
                if (scheduleData) {
                    const parsedScheduleData = JSON.parse(scheduleData);
                    const updatedScheduleData = parsedScheduleData.map((schedule) => {
                        return schedule.map((courseNum) => (courseNum === CourseNo ? -1 : courseNum));
                    });
                    await AsyncStorage.setItem("schedule", JSON.stringify(updatedScheduleData));
                    console.log("Schedule modified");
                    console.log(updatedScheduleData);
                }
                console.log("deleted")
                GetCourses();
            }
        } catch (err) {
            console.log("Error in deleting course", err.message);
        }
    };

    const editCourse = (course) => {
        setCurrentCourse({ ...course });
        console.log(course)
        setModalVisible(true);
    };

    const saveCourse = async () => {
        try {
            const data = await AsyncStorage.getItem("classData");
            if (data) {
                const parsedData = JSON.parse(data);
                const updatedData = parsedData.map((course) => {
                    if (course.CourseNo === currentCourse.CourseNo) {
                        return { ...course, ...currentCourse };
                    }
                    return course;
                });
                await AsyncStorage.setItem("classData", JSON.stringify(updatedData));
                setModalVisible(false);
                GetCourses();
                console.log("saved")
            }
        } catch (err) {
            console.log("Error in saving course", err.message);
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
                                    <Text style={styles.facultyText}>{course.faculty}</Text>
                                    <View style={styles.courseRow}>
                                        <Pressable
                                            onPress={() => editCourse(course)}
                                            style={({ pressed }) => [
                                                {
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    backgroundColor: pressed ? "#e0e0e0" : "#f0f0f0", // Hover effect
                                                    elevation: 2,

                                                }
                                            ]}
                                        >
                                            <MaterialIcons name="edit" size={22} color="grey" />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => confirmDelete(course.courseName)}
                                            style={({ pressed }) => [
                                                {
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    backgroundColor: pressed ? "#e0e0e0" : "#f0f0f0", // Hover effect
                                                    elevation: 2,
                                                }
                                            ]}
                                        >
                                            <MaterialIcons name="delete" size={22} color="grey" />
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
                                    <Text style={styles.facultyText}>{course.faculty}</Text>
                                    <View style={styles.courseRow}>
                                        <Pressable
                                            onPress={() => editCourse(course)}
                                            style={({ pressed }) => [
                                                {
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    backgroundColor: pressed ? "#e0e0e0" : "#f0f0f0", // Hover effect
                                                    elevation: 2,

                                                }
                                            ]}
                                        >
                                            <MaterialIcons name="edit" size={22} color="grey" />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => confirmDelete(course.courseName)}
                                            style={({ pressed }) => [
                                                {
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    backgroundColor: pressed ? "#e0e0e0" : "#f0f0f0", // Hover effect
                                                    elevation: 2,
                                                }
                                            ]}
                                        >
                                            <MaterialIcons name="delete" size={22} color="grey" />
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Edit Course Details</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Course Name"
                            value={currentCourse.courseName}
                            onChangeText={(text) => setCurrentCourse({ ...currentCourse, courseName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Faculty Name"
                            value={currentCourse.faculty}
                            onChangeText={(text) => setCurrentCourse({ ...currentCourse, faculty: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={currentCourse.location}
                            onChangeText={(text) => setCurrentCourse({ ...currentCourse, location: text })}
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => saveCourse()}
                        >
                            <Text style={styles.textStyle}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        // Increase the size
        fontSize: 20,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.7)", // Change the color to lighter black
        textAlign: "left", // Center align the text
        textTransform: "uppercase", // Make text uppercase
        textShadowColor: "rgba(0, 0, 0, 0.2)", // Add shadow
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
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
        padding: 15,
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
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
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
    }, modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#F2EFE5',
        padding: 20,
        borderRadius: 15,
        elevation: 8,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    buttonClose: {
        backgroundColor: "green",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        width: '100%',
        paddingHorizontal: 10,
    },
    button: {
        padding: 10,
        borderRadius: 10,
    },
});

export default CoursesDisplay;