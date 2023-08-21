import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment'

const TripDetails = ({ tripPlan }) => {
  return (
    <View>
        <View>
            <Text style={{ fontWeight: "bold" }} numberOfLines={1}>{moment(tripPlan?.start_date).isSameOrBefore(new Date()) ? 'Probably in' : 'Visiting'} {tripPlan?.destination?.name}</Text>
            <Text numberOfLines={1} style={{ fontWeight: "bold" }}>{moment(tripPlan?.start_date).format("DD MMM")} - {moment(tripPlan?.end_date).format("DD MMM")}</Text>
        </View>
        <View style={{ marginTop:15 }}>
            <Text style={{ fontWeight: "bold" }}>About My Trip</Text>
            <Text>{tripPlan.details}</Text>
        </View>
    </View>
  )
}

export default TripDetails

const styles = StyleSheet.create({})