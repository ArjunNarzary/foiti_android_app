import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Octicons } from "@expo/vector-icons"
import { COLORS } from '../../resources/theme'
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('screen');

const HostUser = ({ item, user, profileUri = "profile_picture.jpg" }) => {
    const navigation = useNavigation();
    const [genderAge, setGenderAge] = useState("");

    useEffect(() => {
        const detailArr = [];
        if(user?.gender){
            const gender = user?.gender;
            const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1);
            detailArr.push(capitalizedGender);
        }
        
        if(user?.dob){
            const age = Math.floor(moment().diff(user?.dob, 'years', true));
            detailArr.push(age);
        }
        let converToString = ""
        if (detailArr.length > 0){
            converToString = detailArr.join(', ');
        }
        setGenderAge(converToString);
    },[user]);


    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.push("Traveller via meetup", { trip_id: item._id })}>
            <Image
                source={{
                    uri: `${process.env.BACKEND_URL}/image/${profileUri}`,
                }}
                style={styles.profile}
            />
            <View style={{ maxWidth: width / 1.47 }}>
                <View style={{ flexDirection:'row', justifyContent:"flex-start", alignItems:"center" }}>
                    <Text numberOfLines={1} style={{ fontWeight: "bold", maxWidth: '65%' }}>{user?.name}</Text>
                    <Octicons name="dot-fill" style={{ fontSize:6, marginHorizontal:5 }} />
                    {genderAge != "" && <Text numberOfLines={1}>{genderAge}</Text>}
                </View>
                <Text numberOfLines={1}>{moment(item?.start_date).isSameOrBefore(new Date()) ?  'Probably in' : 'Visiting'} {item?.destination?.name}</Text>
                <Text numberOfLines={1} style={{ fontWeight: "bold" }}>{moment(item?.start_date).format("DD MMM")} - {moment(item?.end_date).format("DD MMM")}</Text>
            </View>

        </TouchableOpacity>
    )
}

export default HostUser

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