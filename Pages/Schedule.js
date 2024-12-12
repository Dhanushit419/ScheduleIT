import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, StyleSheet, FlatList, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PerDay({ Schedule }) {
    if (!Schedule || Schedule.length === 0) {
        return (
            <View style={styles.noHoursContainer}>
                <Text style={styles.noHoursText}>No hours today</Text>
            </View>
        );
    }
    return (
        <View>
            <FlatList
                data={Schedule}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.periodsRow}>
                        <View style={styles.rowLeft}>
                            <Text style={{ fontSize: 20 }}>{item.hour}</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <View style={styles.rowTop}>
                                <Text style={{ fontSize: 20 }}>{item.courseName}</Text>
                            </View>
                            <View style={styles.rowBottom}>
                                <View style={{ justifyContent: "flex-start" }}><Text>{item.staff}</Text></View>
                                <Text><Ionicons name="location" size={15} color="black" /> {item.location}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const renderTabBar = props => (
    <TabBar
        {...props}
        scrollEnabled={true}
        indicatorStyle={{ backgroundColor: 'black' }}
        renderLabel={({ route }) => (
            <Text style={{ color: "blue", margin: 8, fontWeight: "bold", fontSize: 17 }}>
                {route.title}
            </Text>
        )}
        style={{ backgroundColor: '#B5C0D0' }}
    />
);

export default function TabViewExample() {
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'monday', title: 'Monday' },
        { key: 'tuesday', title: 'Tuesday' },
        { key: 'wednesday', title: 'Wednesday' },
        { key: 'thursday', title: 'Thursday' },
        { key: 'friday', title: 'Friday' }
    ]);

    const [schedule, setSchedule] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    });

    useEffect(() => {
        async function fetchSchedule() {
            try {
                const localSchedule = JSON.parse(await AsyncStorage.getItem("schedule")) || [];
                const classData = JSON.parse(await AsyncStorage.getItem("classData")) || [];

                const mappedSchedule = {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                };

                const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

                days.forEach((day, dayIndex) => {
                    for (let hourIndex = 0; hourIndex < 8; hourIndex++) {
                        const courseNum = localSchedule[dayIndex]?.[hourIndex];

                        if (courseNum !== undefined && courseNum !== -1) {
                            const courseDetails = classData.find(course => course.CourseNo === courseNum);
                            if (courseDetails) {
                                mappedSchedule[day].push({
                                    hour: hourIndex + 1,
                                    courseName: courseDetails.courseName,
                                    staff: courseDetails.faculty,
                                    location: courseDetails.location || "No Location"
                                });
                            }
                        }
                    }
                });

                setSchedule(mappedSchedule);
            } catch (err) {
                console.error("Error fetching schedule: ", err);
            }
        }

        fetchSchedule();
    }, []);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'monday':
                return <PerDay Schedule={schedule.monday} />;
            case 'tuesday':
                return <PerDay Schedule={schedule.tuesday} />;
            case 'wednesday':
                return <PerDay Schedule={schedule.wednesday} />;
            case 'thursday':
                return <PerDay Schedule={schedule.thursday} />;
            case 'friday':
                return <PerDay Schedule={schedule.friday} />;
            default:
                return null;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}

const styles = StyleSheet.create({
    periodsRow: {
        backgroundColor: "white",
        padding: 10,
        width: "95%",
        marginBottom: 5,
        flexDirection: "row",
        justifyContent: 'center',
        alignSelf: 'center',
        //alignItems: 'center',
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
        paddingLeft: 10
    },
    rowBottom: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    noHoursContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noHoursText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
    },
});
