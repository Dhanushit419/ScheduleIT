import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const CoursesDisplay = () => {
    const navigate = useNavigation();

    const [theoryCourses, settheoryCourses] = useState([])
    const [labCourses, setlabCourses] = useState([])
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
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
                    <Text style={styles.headText}>Theory Courses</Text>
                </View>
                <View style={styles.sectionBody}>
                    {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Loading...</Text>
                    </View> :
                        theoryCourses.map((course, ind) => {
                            return <View style={styles.courseBox} key={ind}>
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
                    {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Loading...</Text>
                    </View> :
                        labCourses.map((course, ind) => {
                            return <View style={styles.courseBox} key={100 + ind}>
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
        backgroundColor: "#F2EFE5",
        borderRadius: 15,
        flexBasis: "45%",
        elevation: 10
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