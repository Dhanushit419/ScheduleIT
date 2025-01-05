import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Modal, Pressable, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function App() {
    const navigator = useNavigation();
    const [courseName, setCourseName] = useState('');
    const [faculty, setFaculty] = useState('');
    const [location, setLocation] = useState('');
    const [credit, setCredit] = useState(null);
    const [credits, setCredits] = useState([
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
    ]);
    const [type, setType] = useState(null);
    const [types, setTypes] = useState([
        { label: 'Lab', value: 'Lab' },
        { label: 'Theory', value: 'Theory' },
    ]);
    const [error, setError] = useState({});
    const [openCredit, setOpenCredit] = useState(false);
    const [openType, setOpenType] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [selectedHours, setSelectedHours] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            const savedSchedule = JSON.parse(await AsyncStorage.getItem('schedule')) || Array(5).fill(Array(8).fill(-1));
            setSchedule(savedSchedule);
        };
        fetchSchedule();
    }, []);

    useEffect(() => {
        const backAction = () => {
            navigator.navigate('Courses');
            //return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigator]);

    const validateForm = () => {
        const err = {};
        if (!courseName) err.courseName = 'Course Name is required.';
        if (!faculty) err.faculty = 'Faculty Name is required.';
        if (!location) err.location = 'Location is required.';
        if (!credit) err.credit = 'Credit is required.';
        if (!type) err.type = 'Type is required.';
        setError(err);
        return Object.keys(err).length === 0;
    };

    const handleHourSelect = (day, hour) => {
        const index = selectedHours.findIndex(([d, h]) => d === day && h === hour);
        if (index >= 0) {
            setSelectedHours(selectedHours.filter(([d, h]) => !(d === day && h === hour)));
        } else if (selectedHours.length < credit) {
            setSelectedHours([...selectedHours, [day, hour]]);
        }
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            if (selectedHours.length !== credit) {
                alert(`Please select exactly ${credit} hours.`);
                return;
            }
            try {
                const classData = JSON.parse(await AsyncStorage.getItem('classData')) || [];
                const CourseNo = classData.length + 1;
                classData.push({ CourseNo, courseName, faculty, location, credit, type, classesMissed: 0 });
                await AsyncStorage.setItem('classData', JSON.stringify(classData));

                const updatedSchedule = schedule.map((day, dayIdx) =>
                    day.map((hour, hourIdx) =>
                        selectedHours.some(([d, h]) => d === dayIdx && h === hourIdx)
                            ? CourseNo
                            : hour
                    )
                );
                await AsyncStorage.setItem('schedule', JSON.stringify(updatedSchedule));
                navigator.navigate('Courses');
            } catch (err) {
                console.log('Error Adding Course:', err.message);
            }
        }
    };

    const renderGrid = () => (
        <View>
            {schedule.slice(1, -1).map((day, dayIdx) => (
                <View key={dayIdx + 1} style={styles.row}>
                    <Text style={styles.dayLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][dayIdx]}</Text>
                    {day.map((hour, hourIdx) => {
                        const isSelected = selectedHours.some(([d, h]) => d === dayIdx + 1 && h === hourIdx);
                        const isBlocked = hour !== -1;
                        return (
                            <Pressable
                                key={hourIdx}
                                onPress={() => !isBlocked && handleHourSelect(dayIdx + 1, hourIdx)}
                                style={[
                                    styles.cell,
                                    isBlocked
                                        ? styles.blocked
                                        : isSelected
                                            ? styles.selected
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

    return (
        <ScrollView style={styles.mainview}>
            <View style={styles.container}>
                <Text style={styles.header}>Add a Course</Text>
                <View style={styles.form}>
                    <Text style={styles.text}>Course Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Course Name"
                        value={courseName}
                        onChangeText={setCourseName}
                    />
                    {error.courseName && <Text style={styles.err}>{error.courseName}</Text>}

                    <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', borderWidth: 0 }]}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
                            onPress={() => setType('Theory')}
                        >
                            <View style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#D3D3D3',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: type === 'Theory' ? '#B0B0B0' : 'transparent',
                            }} />
                            <Text style={{ marginLeft: 8, fontSize: 16 }}>Theory</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => setType('Lab')}
                        >
                            <View style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#D3D3D3',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: type === 'Lab' ? '#B0B0B0' : 'transparent',
                            }} />
                            <Text style={{ marginLeft: 8, fontSize: 16 }}>Lab</Text>
                        </TouchableOpacity>
                    </View>

                    {error.type && <Text style={styles.err}>{error.type}</Text>}

                    <Text style={styles.text}>Faculty Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Faculty Name"
                        value={faculty}
                        onChangeText={setFaculty}
                    />
                    {error.faculty && <Text style={styles.err}>{error.faculty}</Text>}

                    <Text style={styles.text}>Location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Location"
                        value={location}
                        onChangeText={setLocation}
                    />
                    {error.location && <Text style={styles.err}>{error.location}</Text>}

                    <Text style={styles.text}>Hours in a week</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <TouchableOpacity
                            style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 5, marginRight: 10 }}
                            onPress={() => setCredit(prev => Math.max(prev - 1, 1))}
                        >
                            <Text style={{ color: '#fff', fontSize: 18 }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18 }}>{credit}</Text>
                        <TouchableOpacity
                            style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 5, marginLeft: 10 }}
                            onPress={() => setCredit(prev => prev + 1)}
                        >
                            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {error.credit && <Text style={styles.err}>{error.credit}</Text>}

                    <Button
                        title="Select Hours"
                        onPress={() => setModalVisible(true)}
                        disabled={!credit}
                    />
                    <View style={{ marginVertical: 5 }} />
                    <Button
                        title="Add Course"
                        onPress={handleSubmit}
                        disabled={selectedHours.length !== credit}
                    />
                </View>

                <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent={true} // Transparent background for the modal
                    onRequestClose={() => setModalVisible(false)} // Close the modal when back button is pressed
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>Select {credit} Hours</Text>
                            <ScrollView>{renderGrid()}</ScrollView>
                            <View style={styles.modalButtons}>
                                <Pressable style={styles.applyButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>APPLY</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <StatusBar style="auto" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainview: {
        backgroundColor: '#123456',
        height: '100%',
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#123456',
        height: '100%',
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
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        margin: 20,
        color: '#FFF',
    },
    form: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 15,
        width: '85%',
        elevation: 8,
    },
    text: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#6c757d',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
    },
    dropDown: {
        borderColor: '#6c757d',
    },
    err: {
        color: '#dc3545',
        marginBottom: 10,
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginVertical: 5,
        minWidth: "70%",
        maxWidth: "100%"
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