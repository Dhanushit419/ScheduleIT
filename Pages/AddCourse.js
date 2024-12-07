import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';

export default function App() {
    const navigator = useNavigation()
    const [courseName, setCourseName] = useState('');
    const [faculty, setFaculty] = useState('');
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

    const validateForm = () => {
        const err = {};
        if (!courseName) err.courseName = 'Course Name is required.';
        if (!faculty) err.faculty = 'Faculty Name is required.';
        if (!credit) err.credit = 'Credit is required.';
        if (!type) err.type = 'Type is required.';
        setError(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            console.log('Form Validated. Submitting...');
            try {
                const classData = JSON.parse(await AsyncStorage.getItem('classData')) || [];
                classData.push({ courseName, faculty, credit, type, classesMissed: 0 });
                await AsyncStorage.setItem('classData', JSON.stringify(classData));
                console.log('Course Added Successfully:');
                navigator.navigate('Courses');
            } catch (err) {
                console.log('Error Adding Course:', err.message);
            }
        } else {
            console.log('Validation Failed.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add a Course</Text>
            <View style={styles.form}>
                {/* Course Name Input */}
                <Text style={styles.text}>Course Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Course Name"
                    value={courseName}
                    onChangeText={setCourseName}
                />
                {error.courseName && <Text style={styles.err}>{error.courseName}</Text>}

                {/* Faculty Name Input */}
                <Text style={styles.text}>Faculty Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Faculty Name"
                    value={faculty}
                    onChangeText={setFaculty}
                />
                {error.faculty && <Text style={styles.err}>{error.faculty}</Text>}

                {/* Credit Dropdown */}
                <Text style={styles.text}>Credits</Text>
                <DropDownPicker
                    open={openCredit}
                    value={credit}
                    items={credits}
                    setOpen={setOpenCredit}
                    setValue={setCredit}
                    setItems={setCredits}
                    placeholder="Select Credit"
                    style={styles.input}
                />
                {error.credit && <Text style={styles.err}>{error.credit}</Text>}

                {/* Type Dropdown */}
                <Text style={styles.text}>Type</Text>
                <DropDownPicker
                    open={openType}
                    value={type}
                    items={types}
                    setOpen={setOpenType}
                    setValue={setType}
                    setItems={setTypes}
                    placeholder="Select Type"
                    style={styles.input}
                />
                {error.type && <Text style={styles.err}>{error.type}</Text>}

                {/* Submit Button */}
                <Button title="Add Course" onPress={handleSubmit} />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#164863',
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        elevation: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    err: {
        color: 'red',
        marginBottom: 10,
    },
});
