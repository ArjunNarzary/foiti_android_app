import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment'
import { Octicons } from "@expo/vector-icons"
import { COLORS } from '../../resources/theme'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { addDestination } from '../../Redux/slices/addDestinationSlice'
import { addTravelFrom } from '../../Redux/slices/addTravellingSlice'

const Trip = ({ trip }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION)

    const editTrip = () => {
        const destinationCordinates = {
            lat: trip?.destination_location?.coordinates[1],
            lng: trip?.destination_location?.coordinates[0]
        }
        const addressCordinates = {
            lat: trip?.address_location?.coordinates[1],
            lng: trip?.address_location?.coordinates[0]
        }

        dispatch(
            addDestination({
                name: trip?.destination?.name || "",
                administrative_area_level_1: trip?.destination?.administrative_area_level_1 || "",
                country: trip?.destination?.country || "",
                short_country: trip?.destination?.short_country || "",
                coordinates: destinationCordinates,
            })
        );

        dispatch(
            addTravelFrom({
                name: trip?.address?.name || "",
                administrative_area_level_1: trip?.address?.administrative_area_level_1 || "",
                country: trip?.address?.country || "",
                short_country: trip?.address?.short_country || "",
                coordinates: addressCordinates,
            })
        );

        navigation.navigate(`TripPlanUpdate via ${REDUXNAVIGATION.name}`, { trip })
    }

    return (
        <View style={styles.container}>
            <View style={styles.destinationContainer}>
                <Text style={{ fontWeight: "bold" }} numberOfLines={1}>{trip?.destination?.name}{trip?.destination?.administrative_area_level_1 && trip?.destination?.administrative_area_level_1 != trip?.destination?.name && `, ${trip?.destination?.administrative_area_level_1}`}</Text>
                {REDUXUSER?.user?._id == trip?.user_id && <TouchableOpacity onPress={editTrip}>
                    <Text style={{ color: COLORS.foitiGrey }}>Edit</Text>
                </TouchableOpacity>}
            </View>
            <View style={styles.dateContainer}>
                <Text numberOfLines={1} style={{ fontWeight: "bold", maxWidth: "60%" }}>{moment(trip?.start_date).format("DD MMM")} - {moment(trip?.end_date).format("DD MMM")}</Text>
            </View>
            <Text>{trip?.details}</Text>
        </View>
    )
}

export default Trip

const styles = StyleSheet.create({
    container:{
        padding: 10,
        backgroundColor:COLORS.foitiGreyLighter,
        borderRadius:12,
        marginBottom:10
    },
    destinationContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center", 
        marginBottom:5
    },
    dateContainer:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 5
    }
})