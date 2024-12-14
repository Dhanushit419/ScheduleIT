import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PerDay({ schedule }) {
    if (!schedule || schedule.length === 0) {
        return (
            <View style={styles.noHoursContainer}>
                <Text style={styles.noHoursText}>No hours today</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={schedule}
            keyExtractor={(item, index) => `${item.courseName}-${index}`}
            renderItem={({ item }) => (
                <View style={styles.periodsRow}>
                    <View style={styles.rowLeft}>
                        <Text style={styles.hourText}>{item.hour}</Text>
                    </View>
                    <View style={styles.rowRight}>
                        <Text style={styles.courseName}>{item.courseName}</Text>
                        <Text style={styles.staff}>{item.staff}</Text>
                        <Text style={styles.location}>{item.location}</Text>
                    </View>
                </View>
            )}
        />
    );
}

export default function ScheduleApp() {
    const [selectedDay, setSelectedDay] = useState('mon');
    const [schedule, setSchedule] = useState({
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        Fri: []
    });

    useEffect(() => {
        async function fetchSchedule() {
            try {
                const localSchedule = JSON.parse(await AsyncStorage.getItem("schedule")) || [];
                const classData = JSON.parse(await AsyncStorage.getItem("classData")) || [];

                const mappedSchedule = {
                    mon: [],
                    tue: [],
                    wed: [],
                    thu: [],
                    Fri: []
                };

                const days = ["mon", "tue", "wed", "thu", "Fri"];

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

    const days = ["mon", "tue", "wed", "thu", "Fri"];

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                {days.map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dayButton,
                            selectedDay === day ? styles.selectedButton : null
                        ]}
                        onPress={() => setSelectedDay(day)}
                    >
                        <Text
                            style={[
                                styles.dayButtonText,
                                selectedDay === day ? styles.selectedButtonText : null
                            ]}
                        >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <PerDay schedule={schedule[selectedDay]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        paddingTop: 20
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 15
    },
    dayButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
    },
    selectedButton: {
        backgroundColor: '#3B82F6',
        elevation: 6
    },
    dayButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    selectedButtonText: {
        color: '#FFF'
    },
    periodsRow: {
        backgroundColor: "#F2EFE5",
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 10,
        flexDirection: "row",
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3
    },
    rowLeft: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "#E5E7EB",
        paddingRight: 8
    },
    rowRight: {
        flex: 3,
        paddingLeft: 12
    },
    hourText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151"
    },
    courseName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937"
    },
    staff: {
        fontSize: 14,
        color: "#6B7280"
    },
    location: {
        fontSize: 14,
        color: "#4B5563",
        marginTop: 4
    },
    noHoursContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noHoursText: {
        fontSize: 18,
        color: "#9CA3AF",
        fontWeight: "bold",
    }
});
