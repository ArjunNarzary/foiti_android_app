import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import MapView, { Marker } from "react-native-maps";
import { COLORS } from '../resources/theme';
import { BACKEND_URL } from "@env";
import { useNavigation } from '@react-navigation/native';
import { MAPSTYLE } from '../utils/mapStyle';
import { useAddPostCoordinatesMutation } from '../Redux/services/serviceApi';
import { useBackHandler } from '@react-native-community/hooks';
import ModalComponent from '../components/ModalComponent';
import { useSelector } from 'react-redux';
import { images as IMAGES } from "resources";
const { width, height } = Dimensions.get("screen");

const DELTAS = {
    latitudeDelta: 0.010036553362031242,
    longitudeDelta: 0.005732215940952301,
}

const AddCoordinates = ({ route }) => {
    const { post, place } = route.params;
    const navigation = useNavigation();
    const REDUXUSER = useSelector((state) => state.AUTHUSER);

    const [activeStatus, setActiveStatus] = useState(false);
    const [iniRegion, setIniRegion] = useState({});
    const [mapType, setMapType] = useState("standard");
    const [modalVisible, setModalVisible] = useState(false);
    const [showMarker, setShowMarker] = useState(false);
    const [myLocation, setMyLocation] = useState({});

    const [addPostCoordinates, { data, error, isLoading, isSuccess, isError }] = useAddPostCoordinatesMutation();

    //ON BACK PRESS
    useBackHandler(() => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: "Home Navigation",
                    state: {
                        routes: [
                            {
                                name: "Drawer Home",
                                state: { routes: [{ name: "Profile" }] },
                            },
                        ],
                    },
                },
            ],
        });
        return true;
    });

    useEffect(() => {
        const currentLocation = {
            latitude: place?.location.coordinates[1],
            longitude: place?.location.coordinates[0],
            ...DELTAS
        }
        setIniRegion({ region: currentLocation })
    }, []);

    const onRegionChange = useCallback((region) => {
        setIniRegion({ region });
        setActiveStatus(true);
    }, []);


    const changeMapType = () => {
        if (mapType === "standard") {
            setMapType("satellite");
        } else {
            setMapType("standard");
        }
    };

    const onSkip = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: "Home Navigation",
                    state: {
                        routes: [
                            {
                                name: "Drawer Home",
                                state: { routes: [{ name: "Profile" }] },
                            },
                        ],
                    },
                },
            ],
        });
    }

    const closeModal = () => {
        setModalVisible(false);
        navigation.reset({
            index: 0,
            routes: [{ name: "Home Navigation" }],
        });
    };

    const addCoords = () => {
        const body = {
            postId: post?._id,
            coordinates: {
                lat: iniRegion?.region?.latitude,
                lng: iniRegion?.region?.longitude
            },
            token: REDUXUSER.token
        }
        addPostCoordinates(body);
    }

    useEffect(() => {
        if (isSuccess) {
            onSkip();
        }
        if (isError) {
            setModalVisible(false);
        }
    }, [isError, isSuccess]);


    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.header}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                    }}
                >Add Coordinates</Text>
                <TouchableOpacity
                    disabled={!activeStatus || isLoading}
                    onPress={addCoords}
                    style={[
                        styles.buttonBox,
                        activeStatus ? styles.activeBackground : styles.inactiveBackground,
                    ]}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#fff" }}>
                            Done
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
                <MapView
                    style={{ width: "100%", height: "100%" }}
                    showsCompass={true}
                    toolbarEnabled={false}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    onMapReady={() => setShowMarker(true)}
                    moveOnMarkerPress={false}
                    rotateEnabled={false}
                    loadingEnabled={true}
                    mapType={mapType}
                    initialRegion={{
                        latitude: parseFloat(iniRegion?.region?.latitude),
                        longitude: parseFloat(iniRegion?.region?.longitude),
                        latitudeDelta: parseFloat(iniRegion?.region?.latitudeDelta),
                        longitudeDelta: parseFloat(iniRegion?.region?.longitudeDelta),
                    }}
                    onRegionChangeComplete={onRegionChange}
                    customMapStyle={MAPSTYLE}
                >
                </MapView>
                {showMarker && <View style={styles.fakeMarker}>
                    <Image
                        source={IMAGES.BG_ACTIVE}
                        style={{ height: 40, width: 40, resizeMode: "contain" }}
                    />
                </View>}
                <View
                    style={{
                        position: "absolute",
                        bottom: -10,
                        right: 17,
                    }}
                >
                    <TouchableOpacity style={[styles.mapTypeButton, { backgroundColor: mapType === "satellite" ? COLORS.foitiGrey : "#fff" }]} onPress={changeMapType}>
                        <FontAwesome5
                            name="satellite"
                            size={20}
                            color={mapType === "satellite" ? "#fff" : "#000"} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                    <Text style={{ fontWeight: "bold", color: COLORS.foitiGrey }}>Skip</Text>
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: `${BACKEND_URL}/image/${post?.content[0]?.image?.thumbnail?.private_id}`,
                        }}
                        style={styles.image}
                    />
                    <Text style={styles.infoText}>
                        We could not detect coordinates from your photo but, you may manually add coordinates. Photos without coordinates will be recommended less and will have one less contribution.
                    </Text>
                </View>
            </View>
            <View style={styles.hrLine} />
            <View
                style={{
                    paddingHorizontal: 17,
                    paddingVertical: 10
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                    }}
                    onPress={() => navigation.navigate("Help")}
                >
                    <Feather
                        name="info"
                        style={{ marginRight: 6 }}
                        size={14}
                        color="black"
                    />
                    <Text style={{ color: "#000" }}>
                        Learn how to capture photos with coordinates
                    </Text>
                </TouchableOpacity>
            </View>
            <ModalComponent
                body="Opps! Something went wrong. Please try again later."
                closeModal={closeModal}
                modalVisible={modalVisible}
                hasButton={true}
            />
        </View>
    )
}

export default AddCoordinates

const styles = StyleSheet.create({
    header: {
        width,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 17,
        paddingVertical: 10,
    },
    activeBackground: {
        backgroundColor: COLORS.foiti,
    },
    inactiveBackground: {
        backgroundColor: COLORS.foitiGreyLight,
    },
    buttonBox: {
        paddingVertical: 7,
        paddingHorizontal: 30,
        borderRadius: 2,
        borderRadius: 17
    },
    skipButton: {
        alignSelf: "center",
        backgroundColor: COLORS.foitiGreyLight,
        paddingHorizontal: 30,
        paddingVertical: 7,
        borderRadius: 3,
        marginBottom: 20,
        borderRadius: 30
    },
    infoContainer: {
        padding: 17
    },
    imageContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    image: {
        width: 118,
        height: 118,
        resizeMode: "cover",
        borderRadius: 12,
        marginRight: 10
    },
    infoText: {
        textAlign: "left",
        flex: 1
    },
    hrLine: {
        width,
        height: 1,
        backgroundColor: COLORS.foitiGreyLighter
    },
    mapContainer: {
        flex: 1,
        position: "relative"
    },
    fakeMarker: {
        alignItems: 'center',
        position: "absolute",
        left: '50%',
        top: "50%",
        marginLeft: -20,
        marginTop: -40,
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    mapTypeButton: {
        marginBottom: 50,
        width: 50,
        height: 50,
        borderRadius: 25,
        // backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
})