import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const CoursesDisplay = () => {
    const navigate = useNavigation();

    const theoryCourse = [
        { name: "Internet of Things", faculty: "Selvi Ravindran" },
        { name: "Distributed Systems", faculty: "Swaminathan" },
        { name: "Internet of Things", faculty: "Selvi Ravindran" },
        { name: "Distributed Systems", faculty: "Swaminathan" },
        { name: "Internet of Things", faculty: "Selvi Ravindran" }, { name: "Internet of Things", faculty: "Selvi Ravindran" },
        { name: "Distributed Systems", faculty: "Swaminathan" },
        { name: "Internet of Things", faculty: "Selvi Ravindran" },
    ]

    const labCourse = [
        { name: "Data Analytics Laboratory", faculty: "Bama" },
        { name: "IoT Laboratory", faculty: "Selvi Ravindran" },
        { name: "Socially relavant Project laboratory", faculty: "Jasmine" },
    ]
    const [theoryCourses, settheoryCourses] = useState(theoryCourse)
    const [labCourses, setlabCourses] = useState(labCourse)

    const GetCourses = async () => {
        console.log("get courses")
        try {
            const data = await AsyncStorage.getItem("classData");
            if (data) {
                const parsedData = JSON.parse(data);
                console.log(parsedData);
                const theoryCourses = parsedData.filter((course) => course.type === "Theory");
                const labCourses = parsedData.filter((course) => course.type === "Lab");
                settheoryCourses(theoryCourses);
                setlabCourses(labCourses);
            }
        } catch (err) {
            console.log("Error in fetching courses", err.message);
        }
    }

    useEffect(() => {
        GetCourses()
        //console.log("course fetching")
    }, [])
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigate.navigate('MainTabs', { screen: 'Profile' });
            return true;
        });

        return () => backHandler.remove(); // Clean up on unmount
    }, [navigate]);

    useFocusEffect(
        React.useCallback(() => {
            GetCourses()
            //console.log("course fetching")
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <View style={styles.sectionHead} >
                    <Text style={styles.headText}>Theories Courses</Text>
                </View>
                <View style={styles.sectionBody}>
                    {
                        theoryCourses.map((course, ind) => {
                            return <View style={styles.courseBox} id={ind + ""}>
                                <Text style={styles.courseText}>{course.courseName}</Text>
                                <Text style={styles.facultyText}>{course.faculty}</Text>
                            </View>
                        })
                    }
                </View>
            </View>
            <View style={styles.section}>
                <View style={styles.sectionHead}>
                    <Text style={styles.headText} >Laboratory Courses</Text>
                </View>
                <View style={styles.sectionBody}>
                    {
                        labCourses.map((course, ind) => {
                            return <View style={styles.courseBox} id={(100 + ind) + ""}>
                                <Text style={styles.courseText}>{course.courseName}</Text>
                                <Text style={styles.facultyText}>{course.faculty}</Text>
                            </View>
                        })
                    }
                </View>
            </View>
            <Pressable onPress={() => {
                console.log("pressed")
                navigate.navigate("AddCourses")
            }}
                style={styles.buttonBox}>

                <Ionicons name="add" size={50} color="white" />

            </Pressable>
            <View style={{ height: 20 }}>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 5,

    },
    section: {

    },
    sectionHead: {
        margin: 13
    },
    headText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    sectionBody: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 13,
        rowGap: 13,
        justifyContent: "",
        margin: "auto",
        marginLeft: 13
    },
    courseBox: {
        padding: 25,
        backgroundColor: "#E5D4FF",
        borderRadius: 15,
        flexBasis: "45%",
        elevation: 5
    },
    courseText: {
        fontSize: 17,
        fontWeight: "500"
    },
    buttonBox: {
        position: "absolute",
        bottom: 10,
        right: 20,
        backgroundColor: "green",
        borderRadius: 10,
        padding: 7, marginBottom: 20
    }

})

export default CoursesDisplay