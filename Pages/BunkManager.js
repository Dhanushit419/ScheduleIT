import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const BunkManager = () => {
    const [pressedIndex, setPressedIndex] = useState(-1);
    const [Att, setAtt] = useState([]);
    const [bunkData, setBunkData] = useState([]);
    const [selectedCourseData, setSelectedCourseData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [averagePercentage, setAveragePercentage] = useState(100);
    const [reasonEditIndex, setReasonEditIndex] = useState(-1);
    const [newReason, setNewReason] = useState('');

    useEffect(() => {
        // console.log('Att state updated:', Att);
        calculateAveragePercentage();
    }, [Att]);

    const GetCourses = async () => {
        const roll = await AsyncStorage.getItem("roll");
        console.log('Roll:', roll);
        const existingData = await AsyncStorage.getItem("classData");
        const parsedData = JSON.parse(existingData);
        const existingBunkData = await AsyncStorage.getItem("bunkData") || '[]';
        console.log('Parsed class data:', parsedData);
        console.log('Parsed bunk data:', JSON.parse(existingBunkData));
        setAtt(parsedData);
        setBunkData(JSON.parse(existingBunkData));
    };

    useEffect(() => {
        console.log("Component mounted");
        GetCourses();
    }, []);

    const calculateAveragePercentage = () => {
        let totalPercentage = 0;
        Att.forEach((row) => {
            const total = row.type === "Theory" ? 45 : 60;
            const missed = parseInt(row.classesMissed);
            const percentage = ((total - missed) / total) * 100;
            totalPercentage += percentage;
        });
        const averagePercentage = totalPercentage / Att.length;
        console.log('Calculated average percentage:', averagePercentage);
        setAveragePercentage(averagePercentage);
    };

    const handleBoxPress = (index) => {
        console.log('Box pressed:', index);
        setPressedIndex(index);
    };

    const handleClose = (index) => {
        console.log('Box closed:', index);
        setPressedIndex(index === pressedIndex ? -1 : index);
    };

    const handleMissed = async (index, skips, action) => {
        console.log('Handle missed called:', { index, skips, action });
        const updatedAtt = [...Att];
        const courseNum = updatedAtt[index].CourseNo;
        const courseName = updatedAtt[index].courseName;
        //console.log(courseNum)
        const today = new Date().toLocaleDateString('en-GB').split('/').join('-');
        console.log('Today:', today);
        let updatedBunkData = [...bunkData];
        const missed = parseInt(updatedAtt[index].classesMissed);

        if (action === 'add' && (skips - missed) > 0) {
            updatedAtt[index].classesMissed = missed + 1;
            const existingEntry = updatedBunkData.find(
                (entry) => entry.date === today && entry.courseNum === courseNum
            );
            console.log('Existing entry:', existingEntry);
            if (existingEntry) {
                existingEntry.hours += 1;
            } else {
                updatedBunkData.push({
                    date: today,
                    courseNum,
                    courseName,
                    hours: 1,
                    reason: '',
                });
            }
            // console.log('Updated bunk data:', updatedBunkData);
        } else if (action === 'remove' && missed > 0) {
            updatedAtt[index].classesMissed = missed - 1;
            let existingEntry = updatedBunkData.find(
                (entry) => entry.date === today && entry.courseNum === courseNum
            );
            if (existingEntry) {
                if (existingEntry.hours > 1) {
                    existingEntry.hours -= 1;
                } else {
                    updatedBunkData = updatedBunkData.filter((entry) => entry !== existingEntry);
                }
            } else {
                // If no entry for today, search for the previous date with the same course number
                const previousEntries = updatedBunkData
                    .filter((entry) => entry.courseNum === courseNum)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                if (previousEntries.length > 0) {
                    existingEntry = previousEntries[0];
                    if (existingEntry.hours > 1) {
                        existingEntry.hours -= 1;
                    } else {
                        updatedBunkData = updatedBunkData.filter((entry) => entry !== existingEntry);
                    }
                }
            }
        }

        //console.log('Updated attendance:', updatedAtt);
        console.log('Updated bunk data:', updatedBunkData);
        setAtt(updatedAtt);
        setBunkData(updatedBunkData);
        await AsyncStorage.setItem('classData', JSON.stringify(updatedAtt));
        await AsyncStorage.setItem('bunkData', JSON.stringify(updatedBunkData));
    };

    const handleView = (courseNum) => {
        console.log('View course:', courseNum);
        const filteredData = bunkData.filter((data) => data.courseNum === courseNum);
        console.log('Filtered course data:', filteredData);
        filteredData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        setSelectedCourseData(filteredData);
        setModalVisible(true);
    };

    const handleReasonUpdate = async (index) => {
        try {
            console.log('Update reason for index:', index);

            if (newReason.trim() === '') {
                alert('Reason cannot be empty.');
                return;
            }

            // Update the selectedCourseData array
            const updatedSelectedData = [...selectedCourseData];
            updatedSelectedData[index].reason = newReason;

            // Update the bunkData array for the specific courseNum and date
            const updatedBunkData = bunkData.map((item) => {
                if (
                    item.courseNum === selectedCourseData.courseNum &&
                    item.date === updatedSelectedData[index].date
                ) {
                    return { ...item, reason: newReason }; // Update the reason for the matching entry
                }
                return item;
            });

            // Update the state
            setSelectedCourseData(updatedSelectedData);
            setBunkData(updatedBunkData);

            // Reset the editing state
            setReasonEditIndex(-1);

            // Save the updated data to AsyncStorage
            await AsyncStorage.setItem('bunkData', JSON.stringify(updatedBunkData));
        } catch (error) {
            console.error('Error updating reason:', error);
        }
    };


    return (
        <ScrollView>
            <View>
                <View style={styles.topContainer}>
                    <View style={{ backgroundColor: "#fff", height: 100, width: 100, borderRadius: 40, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 30, fontFamily: "monospace" }}>{averagePercentage.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={{ fontSize: 30 }}>Average Percentage</Text>
                    </View>
                </View>
            </View>
            <View style={styles.midContainer}>
                {Att.map((row, index) => {
                    const total = row.type === 'Lab' ? 60 : 45;
                    const missed = parseInt(row.classesMissed);
                    const Percentage = ((total - missed) / total) * 100;
                    const skip = row.type === 'Lab' ? 15 : 11;

                    return (
                        <Pressable onPress={() => handleBoxPress(index)} key={index}>
                            <View style={[styles.Box, { height: pressedIndex === index ? 130 : 80 }]}>
                                <View style={{ flexDirection: "column" }}>
                                    <Pressable style={{ marginBottom: pressedIndex === index ? 20 : 0 }}>
                                        {row.type === "Theory" && row.name !== "Open Elective" ? <Ionicons name="book" size={24} color="black" /> : null}
                                        {row.type === "Lab" ? <Ionicons name="laptop" size={24} /> : null}
                                        {row.name === "Open Elective" ? <Ionicons name="bulb" size={24} color="black" /> : null}
                                    </Pressable>
                                    {pressedIndex === index ? <Pressable onPress={() => handleView(row.CourseNo)}>
                                        <MaterialCommunityIcons name="comment-edit" size={27} color="black" />

                                    </Pressable> : null
                                    }
                                </View>

                                <View style={styles.mid}>
                                    <Pressable onPress={() => handleClose(index)}>
                                        <Text style={[styles.subjectText, {
                                            fontSize: pressedIndex === index ? 21 : 18,
                                            transform: [{ translateY: pressedIndex === index ? -15 : 0 }],
                                            justifyContent: "center",
                                        }]}>{row.courseName}</Text>
                                    </Pressable>
                                    {pressedIndex === index ? (
                                        <View style={styles.details}>
                                            <Text>Classes Missed: {missed}</Text>
                                            <Text>{skip - missed === 0 ? "No skips left" : `Skips Left: ${skip - missed}`}</Text>
                                            <Text>Percentage: {Percentage.toFixed(0)}</Text>
                                        </View>
                                    ) : null}
                                </View>
                                <View style={styles.right}>
                                    {pressedIndex === index ? (
                                        <View style={styles.rightPressed}>
                                            <Pressable onPress={() => handleMissed(index, skip, "add")}>
                                                <View style={styles.iconBox}><Ionicons name="add" size={30} /></View>
                                            </Pressable>
                                            <Pressable onPress={() => handleMissed(index, skip, "remove")}>
                                                <View style={styles.iconBox}><Ionicons name="remove" size={30} /></View>
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <Text style={{ fontSize: 18 }}>{Percentage.toFixed(0)}%</Text>
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                    }}
                //onPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            width: '90%',
                            backgroundColor: 'white',
                            borderRadius: 10,
                            padding: 20,
                            elevation: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Bunk Details {selectedCourseData.length !== 0 && selectedCourseData[0].courseName ? <Text>- {selectedCourseData[0].courseName}</Text> : null}</Text>
                        {selectedCourseData.length === 0 ? (
                            <Text>No classes missed</Text>
                        ) : (
                            <View>
                                {/* Table Header */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#f0f0f0',
                                        padding: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#ddd',
                                    }}
                                >
                                    <Text style={{ flex: 1, fontWeight: 'bold' }}>Date</Text>
                                    <Text style={{ flex: 1, fontWeight: 'bold' }}>No. of Hours</Text>
                                    <Text style={{ flex: 1, fontWeight: 'bold' }}>View/Edit Reason</Text>
                                </View>
                                {/* Table Body */}
                                {selectedCourseData.map((data, idx) => (
                                    <View
                                        key={idx}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            padding: 10,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#eee',
                                        }}
                                    >
                                        <Text style={{ flex: 1 }}>{data.date}</Text>
                                        <Text style={{ flex: 1 }}>{data.hours}</Text>
                                        <Pressable
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setReasonEditIndex(idx);
                                                setNewReason(data.reason || '');
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: data.reason ? 'gray' : 'blue',
                                                    textDecorationLine: data.reason ? 'none' : 'underline',
                                                }}
                                            >
                                                {data.reason ? data.reason : 'Add a reason'}
                                            </Text>
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        )}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#2196F3',
                                padding: 10,
                                borderRadius: 5,
                                alignItems: 'center',
                                width: "30%",
                                justifyContent: 'center',
                                alignSelf: 'center',
                                marginTop: 20,
                            }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
                        </TouchableOpacity>
                    </View>



                </View>

                {/* Dialog Box for Editing Reason */}
                {reasonEditIndex !== -1 && (
                    <Modal
                        transparent={true}
                        visible={true}
                        animationType="slide"
                        onRequestClose={() => setReasonEditIndex(-1)}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                            }}
                        >
                            <View
                                style={{
                                    width: '80%',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    padding: 20,
                                    elevation: 10,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Reason</Text>
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: '#ddd',
                                        borderWidth: 1,
                                        marginBottom: 10,
                                        paddingHorizontal: 10,
                                        borderRadius: 5,
                                    }}
                                    placeholder="Enter Reason"
                                    value={newReason}
                                    onChangeText={setNewReason}
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Pressable
                                        style={{
                                            backgroundColor: 'blue',
                                            padding: 10,
                                            borderRadius: 5,
                                            flex: 0.45,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            handleReasonUpdate(reasonEditIndex);
                                            setReasonEditIndex(-1);
                                        }}
                                    >
                                        <Text style={{ color: 'white' }}>Save</Text>
                                    </Pressable>
                                    <Pressable
                                        style={{
                                            backgroundColor: 'gray',
                                            padding: 10,
                                            borderRadius: 5,
                                            flex: 0.45,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => setReasonEditIndex(-1)}
                                    >
                                        <Text style={{ color: 'white' }}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </Modal>

        </ScrollView>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10
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
            margin: 30,
            padding: 20,
            backgroundColor: "#F2EFE5",
            borderRadius: 20,
            elevation: 20,
            //borderWidth: 1,
            // borderColor: "silver"
        },
        Box: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
            marginLeft: 20,
            marginRight: 20,
            padding: 20,
            backgroundColor: "#F2EFE5",
            borderRadius: 20,
            elevation: 5,
            flexDirection: "row",
            justifyContent: "space-between"
        },
        subjectText: {
            fontFamily: "monospace",
            position: "relative",
            // textAlign: 'center',
        },
        midContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        mid: {
            justifyContent: "center"

        },
        details: {
            justifyContent: "center",
            alignItems: "center"

        },
        right: {
            justifyContent: "center",
            alignItems: "center",
        },
        rightPressed: {
            flexDirection: "column",
            height: 100,
            justifyContent: "space-around"
        },
        iconBox: {
            //height: 45,
            backgroundColor: "#fff",
            padding: 5,
            borderRadius: 10,
            //marginBottom: 5,
            elevation: 10

        },
        tableRow: {
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#ddd',
        },
        tableHeader: {
            backgroundColor: '#f4f4f4',
            borderBottomWidth: 2,
            borderColor: '#ccc',
        },
        tableColHeader: {
            flex: 1,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#333',
        },
        tableCol: {
            flex: 1,
            textAlign: 'center',
            padding: 5,
        },
        tableColReason: {
            flex: 1,
            textAlign: 'center',
            padding: 5,
        },
        dialogOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            justifyContent: 'center',
            alignItems: 'center',
        },
        dialogContent: {
            width: 300,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            elevation: 10,
        },
        reasonInput: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 5,
            padding: 10,
            marginBottom: 20,
            backgroundColor: '#f9f9f9',
        },
        dialogActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    }
)

export default BunkManager