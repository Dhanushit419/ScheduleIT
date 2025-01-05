import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Dhanush from '../assets/developers/Dhanush.jpg';
import Yuvaraj from '../assets/developers/yuvaraj.jpeg';

const developers = [
    {
        name: 'Dhanushkumar Sankar',
        image: Dhanush,
        email: 'mailto:dhanushit419@gmail.com',
        linkedin: 'https://www.linkedin.com/in/dhanushkumar-sankar-448a18270/',
        github: 'https://github.com/Dhanushit419',
    },
    {
        name: 'Yuvaraj V',
        image: Yuvaraj,
        email: 'mailto:yuvarajv787@gmail.com',
        linkedin: 'https://www.linkedin.com/in/yuvaraj-v-407275223/',
        github: 'https://github.com/Yuvaraj787',
    },
];

const AboutDevelopers = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.appName}>
                Welcome to Schedule<Text style={styles.highlight}>IT</Text>
            </Text>
            <Text style={styles.appDescription}>
                Developed by passionate IT students <Text style={styles.bold}>Dhanushkumar Sankar</Text> &{' '}
                <Text style={styles.bold}>Yuvaraj Vetrivel</Text> from Anna University, ScheduleIT simplifies time management. View real-time schedules, track weekly plans, and manage absences effortlessly. Stay organized and ace your academic life with ScheduleIT!
            </Text>
            <Text style={styles.label}>Developers</Text>
            <View style={styles.cardsContainer}>
                {developers.map((developer, index) => (
                    <View key={index} style={styles.card}>
                        <Image source={developer.image} style={styles.image} />
                        <Text style={styles.name}>{developer.name}</Text>
                        <View style={styles.contactContainer}>
                            <TouchableOpacity onPress={() => Linking.openURL(developer.email)}>
                                <FontAwesome name="envelope" size={22} color="black" style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(developer.linkedin)}>
                                <FontAwesome name="linkedin" size={24} color="black" style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(developer.github)}>
                                <FontAwesome name="github" size={24} color="black" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
            <TouchableOpacity
                onPress={() => Linking.openURL('https://forms.gle/pfwfaU22LSy5SdGeA')}
                style={styles.feedbackLink}
            >
                <Text style={styles.feedbackText}>Provide Feedback</Text>
            </TouchableOpacity>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>© 2024 Yuvaraj V & Dhanushkumar Sankar. All rights reserved.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
    },
    appName: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    },
    highlight: {
        fontSize: 38,
        fontWeight: 'bold',
        //color: '#4A90E2',
    },
    appDescription: {
        fontSize: 18,
        textAlign: 'justify',
        marginBottom: 20,
        lineHeight: 28,
        color: '#555',
    },
    bold: {
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    label: {
        fontSize: 26, // Slightly increased for emphasis
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#4A4A4A',
        textAlign: 'center', // Center align for better presentation
        //textTransform: 'uppercase', // Makes the text more prominent
        letterSpacing: 1.5, // Adds spacing between letters for elegance
        borderBottomWidth: 2, // Adds a border for visual separation
        borderBottomColor: '#DADADA', // Subtle border color to match the theme
        paddingBottom: 8, // Spacing below text
    },

    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        width: '45%',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    icon: {
        marginHorizontal: 10,
    },
    feedbackLink: {
        marginTop: 30,
        backgroundColor: '#DADADA',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    footerContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        borderRadius: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
});

export default AboutDevelopers;
