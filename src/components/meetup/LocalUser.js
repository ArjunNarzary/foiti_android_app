import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../../resources/theme'
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('screen');

const LocalUser = ({ item, user, profileUri = "profile_picture.jpg" }) => {
    const navigation = useNavigation();
    const [genderAge, setGenderAge] = useState("");
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION)

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


    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.push(`Local via ${REDUXNAVIGATION.name}`, { user })}>
            <Image
                source={{
                    uri: `${process.env.BACKEND_URL}/image/${profileUri}`,
                }}
                style={styles.profile}
            />
            <View style={{ maxWidth: width / 1.47 }}>
                <Text numberOfLines={1} style={{ fontWeight: "bold" }}>{user?.name}</Text>
                {genderAge != "" && <Text numberOfLines={1}>{genderAge}</Text>}
                {/* <Text numberOfLines={1}>{item?.place?.name}{item?.place?.local_address && ", "}{item?.place?.local_address}</Text> */}
                <Text numberOfLines={1}>{item?.place?.local_address}</Text>
            </View>

        </TouchableOpacity>
    )
}

export default LocalUser

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.foitiGreyLighter,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
        marginBottom: 12,
        borderRadius: 12,
        height: 85
    },
    profile: {
        height: 70,
        width: 70,
        borderRadius: 35,
        marginRight: 10
    },
    placeDate: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    }
})