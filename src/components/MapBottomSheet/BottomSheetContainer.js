import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import { BACKEND_URL } from "@env";
import { COLORS } from '../../resources/theme'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Shine
} from "rn-placeholder";

const BottomSheetContainer = ({ place, closeBottomSheet, loading }) => {
    const navigation = useNavigation();
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

    const openPlace = () => {
        const placeId = place.original_place_id || place._id;
        if (
            (place?.types?.length > 1 &&
                (place?.types[1] == "Country" ||
                    place?.types[1] == "State" ||
                    place?.types[1] == "Union Territory")) ||
            place?.destination
        ) {
            navigation.push(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: placeId });
        } else {
            navigation.push(`Place via ${REDUXNAVIGATION.name}`, { place_id: placeId });
        }
    };



    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeContainer} onPress={closeBottomSheet}>
                <Ionicons style={{ fontSize: 25, color: COLORS.foitiGreyLight }} name="close-circle" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeContainer} onPress={openPlace}>
                <View style={styles.imageStyle}>
                    {loading ? (
                        <Placeholder Animation={Shine}>
                            <PlaceholderMedia style={styles.imageStyle} />
                        </Placeholder>
                    ):(
                        <Image
                            source={{
                                uri: `${BACKEND_URL}/image/${place?.cover_photo?.thumbnail?.private_id}`,
                            }}
                            style={styles.imageStyle}
                        />

                    )}
                </View>
                <View style={styles.placeDetails}>
                    <Text numberOfLines={2} style={{ fontWeight: "bold", color: '#000', fontSize: 16 }}>{place?.name}</Text>
                    {place?.types && place.types.length > 1 &&
                        <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 13, marginTop: 5, color: COLORS.foitiBlack }}>{place?.types[1]}</Text>
                    }
                    <View>
                        {loading ? <Placeholder Animation={Shine}>
                            <PlaceholderLine width={30} />
                            <PlaceholderLine width={80} />
                        </Placeholder>
                            : (
                                <>
                                    <View style={styles.hrLine} />
                                    <Text style={{ fontSize: 13 }} numberOfLines={1}>{place.local_address || place.short_address}</Text>
                                </>
                            )
                        }
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default BottomSheetContainer

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#fff',
        // padding: 12,
        borderRadius: 17,
        elevation:2
    },
    closeContainer: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 5,
        zIndex: 100
    },
    placeContainer: {
        flexDirection: "row"
    },
    imageStyle: {
        height: 100,
        width: 100,
        borderTopLeftRadius: 17,
        borderBottomLeftRadius: 17,
    },
    placeDetails: {
        justifyContent: "center",
        marginLeft: 10,
        width: '60%',
    },
    hrLine: {
        width: '100%',
        height: 0.5,
        backgroundColor: COLORS.foitiGreyLighter,
        marginVertical: 5
    }
})