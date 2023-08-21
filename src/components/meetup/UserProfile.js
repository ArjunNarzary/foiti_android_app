import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { formatAddressForMeetupProfile } from '../../utils/helpers';

const UserProfile = ({ user, profileUri = "profile_picture.jpg", isChat=false }) => {
    const [genderAge, setGenderAge] = useState("");
    const navigation = useNavigation();
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);

    useEffect(() => {
        const detailArr = [];
        if (user?.gender) {
            const gender = user?.gender;
            const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1);
            detailArr.push(capitalizedGender);
        }

        if (user?.dob) {
            const age = Math.floor(moment().diff(user?.dob, 'years', true));
            detailArr.push(age);
        }
        let converToString = ""
        if (detailArr.length > 0) {
            converToString = detailArr.join(', ');
        }
        setGenderAge(converToString);
    }, [user]);

    const openMeetupProfile = () => {
        navigation.push(`Local via ${REDUXNAVIGATION.name}`, { user, fromMeetup: false })
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={openMeetupProfile} disabled={!isChat}>
                <Image
                    source={{
                        uri: `${process.env.BACKEND_URL}/image/${profileUri}`,
                    }}
                    style={styles.profile}
                />
            </TouchableWithoutFeedback>
            <View style={{ maxWidth: "75%" }}>
                <TouchableOpacity onPress={openMeetupProfile} disabled={!isChat}>
                    <View>
                        <Text numberOfLines={1} style={{ fontWeight: "bold" }}>{user?.name}</Text>
                        {genderAge != "" && <Text numberOfLines={1}>{genderAge}</Text>}
                        {isChat ? (
                            <Text numberOfLines={1}>{user?.place?.name}{user?.place?.local_address && ', '}{user?.place?.local_address}</Text>
                        ):(
                            // <Text numberOfLines={1}>{user?.place?.name}{user?.place?.local_address || user?.place?.short_address}</Text>
                            <Text numberOfLines={1}>{user?.place && (user?.place?.local_address || user.place.short_address)}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    profile: {
        height: 82,
        width: 82,
        borderRadius: 41,
        resizeMode: "cover",
        marginRight: 10
    },
})