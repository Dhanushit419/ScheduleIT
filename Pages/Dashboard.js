import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, Pressable } from "react-native"
import React, { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import timeToHour from "../functions/currentHour";
import { useFocusEffect } from '@react-navigation/native';

const CardSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
        </View>
    );
};



export default function DashBoard({ navigation }) {

    const [currentTime, setCurrentTime] = useState(new Date());
    var name, dept, sem, roll;
    const [userDetails, setUserDetails] = useState({ name_n: "", dept_n: "" });
    const [userLoading, setUserLoading] = useState(true);
    const [currentDay, setCurrentDay] = useState(0);
    const [currentHour, setCurrentHour] = useState(3);
    const [loading, setLoading] = useState(true)
    const [sch, setSch] = useState({
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
    })
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const [missed, setMissed] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, [])

    async function getMiss() {
        const existingData = await AsyncStorage.getItem("classData");
        const parsedData = JSON.parse(existingData);
        let a = 0
        parsedData.forEach((row) => {
            console.log(row)
            a += parseInt(row.classMissed)
        });

        setMissed(a)
    }

    useFocusEffect(
        React.useCallback(() => {
            getMiss()
        }, [])
    );

    useEffect(() => {
        setCurrentDay(currentTime.getDay())
        console.log("Current day:" + currentTime.getDay())
        async function fetch() {
            try {
                const studentData = await AsyncStorage.getItem("student");
                const student = JSON.parse(studentData);
                name = student.name;
                dept = student.dept;
                sem = student.sem;
                roll = student.roll;
                console.log(name, dept);
                setUserDetails((prev) => {
                    return {
                        name_n: name,
                        dept_n: dept,
                        year_n: sem,
                        roll_n: roll
                    }
                })
                setUserLoading(false);
            } catch (err) {
                console.log("Error in Dashboard.js Fetching User details from async storage : ", err.message)
            }
        }
        fetch()

        async function fetchScheduleFromLocalStorage() {
            try {
                const scheduleData = await AsyncStorage.getItem("schedule");
                if (scheduleData) {
                    const parsedSchedule = JSON.parse(scheduleData);
                    var currentHour = timeToHour(currentTime.getHours(), currentTime.getMinutes()) || 1;
                    console.log("Current hour : ", currentHour);
                    setCurrentHour(currentHour);

                    const updatedSchedule = {};
                    const day = days[currentDay];
                    if (parsedSchedule[currentDay]) {
                        updatedSchedule[day] = parsedSchedule[currentDay];
                        console.log(updatedSchedule)
                        updatedSchedule[day] = parsedSchedule[currentDay].slice(3 - 1);
                        console.log(updatedSchedule)
                    } else {
                        console.log("No schedule found for today");
                    }
                    setSch(updatedSchedule);
                    setLoading(false);
                }
            } catch (err) {
                console.log("Error in fetching schedule from local storage: ", err.message);
            }
        }

        fetchScheduleFromLocalStorage();

        getMiss()

    }, [])

    const navigate = useNavigation()

    const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });


    return (
        <View style={styles.main}>
            {/* top container */}
            <View style={styles.top}>
                {/*First view for welcome msg */}
                {userLoading ? <CardSkeleton /> : <View>
                    <Text style={{
                        fontSize: 22, fontFamily: "monospace",
                        fontWeight: "bold"
                    }}>Welcome , </Text>
                    <Text style={styles.nametext}><Text style={{
                        fontSize: 30, fontFamily: "monospace",
                    }}>{userDetails.name_n} </Text><Text>{userDetails.dept_n == "IT" ? "B.Tech " : "B.E "} {userDetails.dept_n}</Text></Text>
                </View>}
                {/* second view for 3 boxes */}
                {loading ? <CardSkeleton /> : <View style={styles.boxContainer} >
                    <View>
                        <Pressable style={styles.box}
                            onPress={() => { navigate.navigate("Attendence") }}>
                            <Text style={{ fontSize: 23, fontFamily: "monospace" }}>{missed}</Text>
                            <Text style={{ width: 100, textAlign: "center", padding: 1 }}>Classes Missed</Text>
                        </Pressable>
                    </View>
                    <View style={styles.box2}>
                        <Text style={styles.time}>{formattedTime}</Text>
                    </View>
                </View>}
            </View>
            <View style={styles.bottom}>
                {loading ? <CardSkeleton /> : <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15, alignItems: "center" }}>
                    <Text style={{ fontSize: 20, fontFamily: "monospace" }}>Upcoming classes</Text>
                    <Pressable onPress={() => { navigate.navigate("Schedule") }}><Ionicons name="calendar" size={22}></Ionicons></Pressable>
                </View>}
                {loading || !sch ? <CardSkeleton /> :
                    <View style={styles.periods}>
                        <View>{sch[days[currentDay]].length == 0 ?
                            <View style={styles.overBox}>
                                <View>{(currentDay == 0 || currentDay == 6) ? <Text style={styles.classOverText}>Yeah Dude, Today is not a working day. Chill...</Text> : <Text style={styles.classOverText}>Hurrah !  Classes are over for today</Text>}</View>
                                <View>
                                    <View
                                        style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: 0 }}><Text style={{ fontWeight: 900, fontSize: 17 }}>Suggested Activities</Text></View>
                                    <View style={styles.actBox}>
                                        <TouchableOpacity style={styles.btnBoxes} onPress={() => navigate.navigate("AttendenceDisplay")}>
                                            <View style={styles.pressBox}>
                                                <FontAwesome name="hand-stop-o" size={34} color="black" />
                                                <Text style={styles.boxText}>Check Attendance</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btnBoxes}>
                                            <View style={styles.pressBox}>
                                                <Ionicons name='timer-sharp' size={34} color="black" />
                                                <Text style={styles.boxText}>Today's Routine</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View> :
                            <FlatList
                                data={sch[days[currentDay]]}
                                renderItem={({ item }) => {
                                    //console.log(item.Subject)
                                    return (
                                        <View style={{ ...styles.periodsRow, backgroundColor: currentHour == item.hour ? "#D4E7C5" : "#F2EFE5", borderColor: (currentHour == item.hour) ? "black" : "silver" }}>
                                            <View style={styles.rowLeft}>
                                                <Text style={{ fontSize: 20 }}>{item.hour}</Text>
                                            </View>
                                            <View style={styles.rowRight}>
                                                <View style={styles.rowTop}>
                                                    {currentHour == item.hour && <Text style={{ fontWeight: "normal" }}>Currently Ongoing</Text>}
                                                    <Text style={{ fontSize: 20 }}>{item.courseName}</Text>
                                                </View>
                                                <View style={styles.rowBottom}>
                                                    <View style={{ justifyContent: "flex-start" }}><Text><Ionicons name="person" size={15} color="black" /> {item.staff}</Text></View>
                                                    <Text>  <Ionicons name="location" size={15} color="black" /> {item.location ? item.location : "Location not given"}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }}
                            />}
                        </View>
                    </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

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
    overBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignSelf: "flex-start",
        rowGap: 10
    },
    classOverText: {
        fontSize: 17,
        fontWeight: "bold"
    },
    actBox: {
        display: "flex",
        flexDirection: "row"
    },
    main: {
        flex: 1,
        padding: 20,
    },
    top: {
        flex: 2,
    },
    bottom: {
        flex: 3,
    },
    welcome: {
        flex: 1
    },
    nametext: {
        justifyContent: "center",
        marginLeft: 30
    },
    boxContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    box: {
        height: 100,
        width: 100,
        elevation: 5,
        backgroundColor: "#fff",
        // borderWidth: 1,
        //borderColor: "silver",
        borderRadius: 10,
        marginBottom: 5,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"

    },
    box2: {
        //time box
        flex: 2,
        height: 120,
        elevation: 5,
        backgroundColor: "#fff",
        // borderWidth: 1,
        //borderColor: "silver",
        borderRadius: 10,
        marginBottom: 5,
        marginLeft: 20,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    time: {
        fontSize: 30,
        fontFamily: "monospace",
        marginBottom: 5
    },
    periods: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        rowGap: 10
    },
    periodsRow: {
        backgroundColor: "white",
        padding: 10,
        width: "100%",
        marginBottom: 5,
        flexDirection: "row",
        marginTop: 5,
        borderColor: "silver",
        borderWidth: 1,
        borderRadius: 10,
        elevation: 5

    },
    rowLeft: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        marginRight: 5,
        paddingRight: 6
    },
    rowRight: {
        flex: 9
    },
    rowTop: {
        flex: 1,
        //marginLeft: 30
        paddingLeft: 10
    },
    rowBottom: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    boxText: {
        textAlign: "center"
    },
    container: {
        backgroundColor: '#F6F6F6',
        borderRadius: 13,
        padding: 16,
        marginBottom: 16,
        marginTop: 50,
    },
    placeholder: {
        backgroundColor: '#ccc',
        height: 16,
        borderRadius: 4,
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 8,
        color: "green",
    },
    paragraph: {
        fontSize: 15,
        color: '#555555',
    }
})