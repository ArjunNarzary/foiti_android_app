import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import moment from "moment";
import { Feather, Entypo } from "@expo/vector-icons"
import { COLORS } from '../../resources/theme'
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");

const UpcomingTrip = ({ userData, fromMeetup }) => {
    const navigation = useNavigation()
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);

    const myTripPlans = () => {
        navigation.push(`TripPlanList via ${REDUXNAVIGATION.name}`, { user_id: userData?.user?._id })
    }

  return (
      <View style={styles.tripContainer}>
          <View style={styles.tripHeader}>
              <TouchableOpacity onPress={myTripPlans}>
                  <Text>Upcoming trips:</Text>
              </TouchableOpacity>
              {REDUXUSER?.user?._id === userData?.user?._id && !fromMeetup && (<TouchableOpacity onPress={myTripPlans}>
                  <Feather name="edit" style={{ fontSize: 16, color: COLORS.foitiGrey }} />
              </TouchableOpacity>)}
          </View>
          {userData.tripPlans.map(trip => (
            <View key={trip._id} style={{ flexDirection:"row" }}>
                  <TouchableOpacity style={styles.trips} onPress={myTripPlans}>
                  <Text style={styles.singleTrip}>{trip?.destination?.name}</Text>
                  <Entypo name="dot-single" style={[styles.singleTrip, { marginHorizontal: 2 }]} />
                  <Text style={styles.singleTrip}>{moment(trip?.start_date).format("DD MMM")} - {moment(trip?.end_date).format("DD MMM")}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
  )
}

export default UpcomingTrip

const styles = StyleSheet.create({
    tripContainer: {
        backgroundColor: COLORS.foitiGreyLighter,
        width,
        marginLeft: -11,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 6
    },
    tripHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2
    },
    trips: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 3
    },
    singleTrip: {
        color: COLORS.foiti,
        fontWeight: "bold",
    }
})