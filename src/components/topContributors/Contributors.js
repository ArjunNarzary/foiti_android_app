import React, { memo } from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { COLORS } from '../../resources/theme'
const { width } = Dimensions.get("screen");

const Contributors = ({ user, type, place }) => {
    const navigation = useNavigation();
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
    const openUserProfile = () => navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, { userId: user?._id });
    
    return (
        <TouchableWithoutFeedback  onPress={openUserProfile}>
            <View style={styles.mainContainer}>
                <Image
                    source={{ uri: `${process.env.BACKEND_URL}/image/${user?.profileImage?.thumbnail?.private_id || `profile_picture.jpg`}` }}
                    style={styles.profile}
                />
                <View>
                    <View style={styles.name}>
                        <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: "bold" }}>
                            {user?.name} <Text style={{ color: 'rgba(0,0,0,0)' }}>x</Text>
                        </Text>
                        {user?.foiti_ambassador && (
                            <MaterialCommunityIcons
                                name="shield-check"
                                style={{ color: COLORS.foiti, fontSize: 15, marginLeft: -9, marginBottom: -3 }}
                            />
                        )}
                    </View>
                    <Text numberOfLines={1} style={styles.username}>
                        {user?.total_contribution}{" "}
                        {user?.total_contribution > 1
                            ? "Contributions"
                            : "Contribution"}
                    </Text>
                    {type === "country" && 
                        <Text numberOfLines={1} style={styles.address}>
                            {user?.place?.display_address?.admin_area_1 || user?.place?.address?.administrative_area_level_1}
                        </Text>
                    }
                    {place && place.types && place.types[1] !== "town" && place.types[1] !== "city" &&
                        <Text numberOfLines={1} style={styles.address}>
                            {user?.place?.name}
                        </Text>
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default memo(Contributors)

const styles = StyleSheet.create({
    mainContainer:{
        flexDirection: "row",
        justifyContent:"flex-start",
        alignItems:"center"
    },
    profile: {
        height: 75,
        width: 75,
        borderRadius: 75/2,
        resizeMode: "cover",
        marginRight: 10
    },
    name:{
        flexDirection:"row",
        justifyContent: 'flex-start',
        alignItems:"center", 
        maxWidth: width - 150 
    },
    username: {
        fontSize: 12,
        lineHeight: 17,
        color: COLORS.foitiGrey,
    },
    address:{
        color: COLORS.foiti,
        fontWeight:"700",
        fontSize: 13
    },
    // creatorBox:{
    //     marginHorizontal: 15,
    //     paddingVertical:20,
    //     backgroundColor: COLORS.foitiGreyLighter
    // }
})