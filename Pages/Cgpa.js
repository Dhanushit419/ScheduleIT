import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cgpa = () => {
    const [cgpa, setCgpa] = useState([]);
    const [CgpaVal, setCgpaVal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedSem, setSelectedSem] = useState(null);
    const [inputs, setInputs] = useState({
        eightCredit: 0,
        sixCredit: 0,
        fourCredit: 0,
        threeCredit: 0,
        twoCredit: 0,
        oneCredit: 0,
    });
    const [grades, setGrades] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    const calculateAverageCgpa = (cgpaArray) => {
        const validCgpa = cgpaArray.filter(num => num > 0);
        const totalCgpa = validCgpa.reduce((acc, num) => acc + parseFloat(num), 0);
        const averageCgpa = validCgpa.length > 0 ? (totalCgpa / validCgpa.length).toFixed(2) : 0;
        setCgpaVal(averageCgpa);
    };

    useEffect(() => {
        const fetchCgpa = async () => {
            try {
                console.log('Fetching CGPA from AsyncStorage...');
                const storedCgpa =
                    JSON.parse(await AsyncStorage.getItem('cgpa')) || Array(8).fill(0);
                console.log('Fetched CGPA:', storedCgpa);
                calculateAverageCgpa(storedCgpa);

                setCgpa(storedCgpa);
            } catch (error) {
                console.error('Error fetching CGPA:', error);
            }
        };
        fetchCgpa();
    }, []);

    const handleBoxClick = (index) => {
        console.log(`Box clicked for Semester ${index + 1}`);
        setSelectedSem(index);
        setShowModal(true);
        setInputs({
            eightCredit: 0,
            sixCredit: 0,
            fourCredit: 0,
            threeCredit: 0,
            twoCredit: 0,
            oneCredit: 0,
        });
        setGrades([]);
        setTotalCredits(0);
        setTotalPoints(0);
    };

    const handleClose = () => {
        console.log('Closing modal...');
        setShowModal(false);
    };

    const handleInputChange = (key, value) => {
        console.log(`Input changed for ${key}:`, value);
        setInputs((prev) => ({
            ...prev,
            [key]: parseInt(value) || 0,
        }));
    };

    const generateGradeInputs = () => {
        console.log('Generating grade inputs...');
        let allGrades = [];
        const creditMapping = {
            eightCredit: 8,
            sixCredit: 6,
            fourCredit: 4,
            threeCredit: 3,
            twoCredit: 2,
            oneCredit: 1,
        };

        ['eightCredit', 'sixCredit', 'fourCredit', 'threeCredit', 'twoCredit', 'oneCredit'].forEach(
            (key) => {
                const creditValue = creditMapping[key]; // Correctly map the credit value
                for (let i = 0; i < inputs[key]; i++) {
                    allGrades.push({ credit: creditValue, id: `${key}-${i}`, grade: 0 });
                }
            }
        );
        console.log('Generated grades:', allGrades);
        setGrades(allGrades);
    };

    const handleGradeChange = (id, value) => {
        console.log(`Grade changed for ${id}:`, value);
        setGrades((prev) =>
            prev.map((grade) =>
                grade.id === id ? { ...grade, grade: parseInt(value) || 0 } : grade
            )
        );
    };

    const calculateGpa = async () => {
        console.log('Calculating GPA...');
        let credits = 0;
        let points = 0;

        // Calculate total credits and points
        grades.forEach((grade) => {
            if (grade.grade > 0) {
                credits += grade.credit; // Add the credit value for each course
                points += grade.credit * grade.grade; // Calculate total points for each course
            }
        });

        // GPA calculation: GPA = total points / total credits
        const gpa = credits > 0 ? (points / credits).toFixed(2) : 0;
        console.log(`GPA for Semester ${selectedSem + 1}:`, gpa);

        // Update CGPA
        const updatedCgpa = [...cgpa];
        updatedCgpa[selectedSem] = gpa;
        console.log('Updated CGPA:', updatedCgpa);
        setCgpa(updatedCgpa);
        calculateAverageCgpa(updatedCgpa)
        // Store CGPA
        try {
            console.log('Storing updated CGPA to AsyncStorage...');
            await AsyncStorage.setItem('cgpa', JSON.stringify(updatedCgpa));
            console.log('CGPA successfully stored.');
        } catch (error) {
            console.error('Error storing CGPA:', error);
        }

        setShowModal(false);
    };
    const resetCgpa = () => {
        Alert.alert(
            "Reset CGPA",
            "Are you sure you want to reset your GPA Records and CGPA?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            setCgpaVal(0);
                            setCgpa(Array(8).fill(0));
                            await AsyncStorage.removeItem('cgpa');
                            await AsyncStorage.setItem('cgpa', JSON.stringify(Array(8).fill(0)));

                            console.log('CGPA reset successfully.');
                        } catch (error) {
                            console.error('Error resetting CGPA:', error);
                        }
                    }
                }
            ]
        );
        console.log('done');

    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.cgpaContainer}>
                <Text style={styles.cgpaTitle}>CGPA : {CgpaVal}</Text>

                <View style={styles.cgpaRow}>
                    {cgpa.map((value, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleBoxClick(index)}
                            style={styles.box}
                        >
                            <Text style={styles.value}>{value}</Text>
                            <Text>Sem-{index + 1}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button title="Reset" onPress={resetCgpa}>
                    Reset
                </Button>

            </View>

            {/* Modal for GPA Calculation */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={handleClose}
            >
                <ScrollView contentContainerStyle={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Semester {selectedSem + 1} - (Enter No of Courses for Each Credit )
                        </Text>

                        {/* Credit Inputs */}
                        {[{ key: 'eightCredit', label: '8-credit courses (8)' }, { key: 'sixCredit', label: '6-credit courses (6)' },
                        { key: 'fourCredit', label: '4-credit courses (4)' },
                        { key: 'threeCredit', label: '3-credit courses (3)' },
                        { key: 'twoCredit', label: '2-credit courses (2)' },
                        { key: 'oneCredit', label: '1-credit courses (1)' },
                        ].map(({ key, label }, idx) => (
                            <View style={styles.inputRow} key={idx}>
                                <Text>{label}:</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={inputs[key].toString()}
                                    onChangeText={(value) =>
                                        handleInputChange(key, value)
                                    }
                                />
                            </View>
                        ))}

                        <Button title="Generate Inputs" onPress={generateGradeInputs} />
                        <View style={{ marginVertical: 5 }} />
                        {/* Grade Inputs */}
                        {grades.map((grade, idx) => (

                            <View style={styles.inputRow} key={grade.id}>
                                <Text>Course {idx + 1} (Credit: {grade.credit}):</Text>
                                <Picker
                                    selectedValue={grade.grade || 0}
                                    onValueChange={(value) =>
                                        handleGradeChange(grade.id, value)
                                    }
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select Grade" value={0} />
                                    <Picker.Item label="O (10)" value={10} />
                                    <Picker.Item label="A+ (9)" value={9} />
                                    <Picker.Item label="A (8)" value={8} />
                                    <Picker.Item label="B+ (7)" value={7} />
                                    <Picker.Item label="B (6)" value={6} />
                                    <Picker.Item label="C (5)" value={5} />
                                    <Picker.Item label="U (0)" value={0} />
                                </Picker>
                            </View>
                        ))}

                        <Button title="Calculate GPA" onPress={calculateGpa} />
                        <View style={{ marginVertical: 5 }} />
                        <Button title="Close" onPress={handleClose} />
                    </View>
                </ScrollView>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
    },
    cgpaContainer: {
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    cgpaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    cgpaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    box: {
        width: '45%',
        margin: 5,
        padding: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    value: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    modalContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4CAF50',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    input: {
        width: '60%',
        borderWidth: 1,
        borderColor: '#4CAF50',
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#f4f4f4',
    },
    picker: {
        width: '60%',
        height: 60,
    },
});

export default Cgpa;
