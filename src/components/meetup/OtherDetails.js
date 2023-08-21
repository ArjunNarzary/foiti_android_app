import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OtherDetails = ({ user }) => {
    return (
        <View>
            {user?.bio ? (
            <View style={styles.subSection}>
                <Text style={styles.label}>About me</Text>
                    <Text>{user?.bio}</Text>
            </View>) : null}
            {user?.meetup_reason ? (
            <View style={styles.subSection}>
                <Text style={styles.label}>Why I wish to meet other travellers</Text>
                <Text>{user?.meetup_reason}</Text>
            </View>) : null}
            {user?.interests ? (
            <View style={styles.subSection}>
                <Text style={styles.label}>Interests</Text>
                <Text>{user?.interests}</Text>
            </View>): null}
            {user?.education ? (
            <View style={styles.subSection}>
                <Text style={styles.label}>Education</Text>
                <Text>{user?.education}</Text>
            </View>): null}
            {user?.occupation ? (
            <View style={styles.subSection}>
                <Text style={styles.label}>Occupation</Text>
                <Text>{user?.occupation}</Text>
            </View>) : null}
            {(user?.languages && user?.languages.length > 0) ? ( 
            <View style={styles.subSection}>
                <Text style={styles.label}>Languages</Text>
                <Text>{user?.languages.join(", ")}</Text>
            </View>) : null}
            {user?.movies_books_music ? (
            <View style={styles.subSection}>
                <Text style={styles.label}>Movies, Books & Music</Text>
                <Text>{user?.movies_books_music}</Text>
            </View>
            ):null}
        </View>
    )
}

export default OtherDetails

const styles = StyleSheet.create({
    subSection: {
        marginBottom: 15
    },
    label: {
        fontWeight: "bold"
    }
})