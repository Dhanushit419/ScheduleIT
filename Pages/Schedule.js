import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
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
        fri: []
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [newCourse, setNewCourse] = useState('');
    async function fetchSchedule() {
        try {
            const localSchedule = JSON.parse(await AsyncStorage.getItem("schedule")) || [];
            const classData = JSON.parse(await AsyncStorage.getItem("classData")) || [];

            const mappedSchedule = {
                mon: [],
                tue: [],
                wed: [],
                thu: [],
                fri: []
            };

            const days = ["mon", "tue", "wed", "thu", "fri"];

            days.forEach((day, dayIndex) => {
                for (let hourIndex = 0; hourIndex < 8; hourIndex++) {
                    const courseNum = localSchedule[dayIndex + 1]?.[hourIndex];

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
    useEffect(() => {
        fetchSchedule();
    }, []);

    const [scheduleList, setScheduleList] = useState(Array(5).fill(Array(8).fill(-1)));
    const [selectedHour, setSelectedHours] = useState([]);
    const [modalText, setModalText] = useState("Edit TimeTable");

    const handleHourSelect = (day, hour) => {
        const index = selectedHour.findIndex(([d, h]) => d === day && h === hour);
        if (index >= 0) {
            setSelectedHours(selectedHour.filter(([d, h]) => !(d === day && h === hour)));
        } else if (selectedHour.length < 2) {
            setSelectedHours([...selectedHour, [day, hour]]);
        }
        //console.log(selectedHour)
    };

    const swapSelectedHours = () => {
        if (selectedHour.length === 2) {
            console.log(selectedHour)
            const [[day1, hour1], [day2, hour2]] = selectedHour;
            console.log(scheduleList
            )
            const newScheduleList = scheduleList.map((day, dayIdx) =>
                day.map((hour, hourIdx) => {
                    if (dayIdx === day1 && hourIdx === hour1) {
                        return scheduleList[day2][hour2];
                    } else if (dayIdx === day2 && hourIdx === hour2) {
                        return scheduleList[day1][hour1];
                    } else {
                        return hour;
                    }
                })
            );

            setScheduleList(newScheduleList);
            console.log(newScheduleList)
            AsyncStorage.setItem('schedule', JSON.stringify(newScheduleList));
            fetchSchedule()
        }
    };


    useEffect(() => {
        if (selectedHour.length == 0) {
            setModalText("Edit TimeTable")
        }
        else if (selectedHour.length == 1) {
            setModalText("Select Another Hour to Swap ")
        }
        else if (selectedHour.length == 2) {
            //fuction for swap

            setModalText("Swapped !")

            setTimeout(() => {
                setModalText("Edit TimeTable");
                swapSelectedHours()
                setSelectedHours([]);
            }, 1000);
        }
    }, [selectedHour])

    useEffect(() => {
        const fetchSchedule2 = async () => {
            const savedSchedule = JSON.parse(await AsyncStorage.getItem('schedule')) || Array(5).fill(Array(8).fill(-1));
            setScheduleList(savedSchedule);
        };
        fetchSchedule2();
    }, []);

    const renderGrid = () => (
        <View>
            {scheduleList.slice(1, -1).map((day, dayIdx) => (
                <View key={dayIdx + 1} style={styles.row}>
                    <Text style={styles.dayLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][dayIdx]}</Text>
                    {day.map((hour, hourIdx) => {
                        const isSelected = selectedHour.some(([d, h]) => d === dayIdx + 1 && h === hourIdx);
                        const isBlocked = hour !== -1;
                        return (
                            <Pressable
                                key={hourIdx}
                                onPress={() => handleHourSelect(dayIdx + 1, hourIdx)}
                                style={[
                                    styles.cell,
                                    isSelected
                                        ? styles.selected
                                        : isBlocked
                                            ? styles.blocked
                                            : styles.available,
                                ]}
                            >
                                <Text style={styles.cellText}>{hourIdx + 1}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            ))}
        </View>
    );

    const days = ["mon", "tue", "wed", "thu", "fri"];

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
            <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.editButtonText}>Edit Timetable</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true} // Transparent background for the modal
                onRequestClose={() => setModalVisible(false)} // Close the modal when back button is pressed
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>{modalText}</Text>
                        <ScrollView>{renderGrid()}</ScrollView>
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.applyButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>

            </Modal >

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
    },
    editButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 15,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginVertical: 5,
        minWidth: "70%",
        maxWidth: "100%"
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        justifyContent: "flex-start",
        textAlign: 'left',
        width: 35,
        marginRight: 0
    },
    cell: {
        width: 25,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 5,
        borderWidth: 1,
    },
    cellText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    blocked: {
        backgroundColor: '#b0b0b0',
        borderColor: '#b0b0b0',
    },
    available: {
        backgroundColor: '#f0f0f0',
        borderColor: '#ccc',
    },
    selected: {
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
    },
    modalOverlay: {
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
    },
    applyButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10,
    },
    closeButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
