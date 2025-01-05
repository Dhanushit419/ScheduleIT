import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const faqData = [
    {
        title: "Dashboard",
        description: "The Dashboard provides an overview of your current day. It shows your real-time schedule, including the current and upcoming periods, helping you stay on top of your day."
    },
    {
        title: "Add Course",
        description: "This page allows you to add a new course to your schedule. You can enter the course name, type, number of hours in a week, and faculty details to create a new course."
    },
    {
        title: "Courses",
        description: "This page displays your course details, including the course name, type, and faculty. You can also add/delete courses to your schedule."
    },
    {
        title: "Weekly Schedule",
        description: "This page displays a comprehensive view of your schedule for the entire week day by day. You can edit the timetable by swapping two periods."
    },
    {
        title: "Bunk Manager",
        description: "This feature helps you track your attendance record. You can view the total number of classes attended and missed, ensuring you stay above the minimum attendance requirement. You can also add reasons for bunking the class to get OD/Medical Certificate."
    },
    {
        title: "CGPA Manager",
        description: "The CGPA Manager allows you to calculate your CGPA based on your grades. You can add your grades for each semester and view your CGPA instantly."
    },
    {
        title: "Reset and Logout",
        description: "You can reset your data and also logout from the app by clicking on the Logout button in the Profile Page."
    },
    {
        title: "Feedback",
        description: "You can go to the Feedback section through the About Developers Page. This page allows you to share your thoughts or report issues. Use the form to help us improve your experience."
    },
];

const FAQPage = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleSection = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Know Your App</Text>
            {faqData.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                    <TouchableOpacity onPress={() => toggleSection(index)} style={styles.faqHeader}>
                        <Text style={styles.title}>{item.title}</Text>
                        <FontAwesome name={expandedIndex === index ? "chevron-up" : "chevron-down"} size={20} color="#4A4A4A" />
                    </TouchableOpacity>
                    {expandedIndex === index && <Text style={styles.description}>{item.description}</Text>}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#EFEFEF',
        flexGrow: 1,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    },
    faqItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginVertical: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
        lineHeight: 24,
    },
});

export default FAQPage;
