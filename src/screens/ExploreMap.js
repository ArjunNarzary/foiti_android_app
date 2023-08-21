

import React, { useEffect, useCallback, useMemo, useRef, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import BottomSheet from "@gorhom/bottom-sheet"
import { useDispatch, useSelector } from "react-redux"
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"
import * as Location from "expo-location"
import * as Linking from "expo-linking"
import { useFocusEffect } from "@react-navigation/native"
import RadialGradient from "react-native-radial-gradient"
import { useNavigation } from "@react-navigation/native"
import { useBackHandler } from "@react-native-community/hooks"

import {
  useExploreMapPlacesMutation,
  useExploreMapPostDetailsMutation,
  useExploreMapPostMutation,
} from "../Redux/services/serviceApi"
import { COLORS } from "../resources/theme"
import { MAPSTYLE } from "../utils/mapStyle"
import { getIpLocation } from "../Redux/customApis/api"
import { clearAlert } from "../Redux/slices/alertSlice"
import { removeRouteParams } from "../Redux/slices/routeParamSlice"

import PostMarker from "../components/MapMarkers/PostMarker"
import MapExplorePost from "../components/MapExplorePost"
import NearbyInfoModal from "../components/Nearby/NearbyInfoModal"
import PostBottomSheetContainer from "../components/MapBottomSheet/PostBottomSheetConatiner"
import CustomAlert from "../components/CustomAlert"
import { addCoords } from "../Redux/slices/locationSlice"
const { width, height } = Dimensions.get("screen")

const DELTAS = {
  latitudeDelta: 2.90211721990001,
  longitudeDelta: 1.6635556519031525,
  // latitudeDelta: 2.6853810797935687,
  // longitudeDelta: 1.421998254954815,
}

const RECENTER_DELTAS = {
  latitudeDelta: 0.3123823856942991,
  longitudeDelta: 0.17843831330536375,
}

const INDIA_COORDS = {
  latitude: 28.643666062273496,
  longitude: 77.21406167373061,
  latitudeDelta: 2.90211721990001,
  longitudeDelta: 1.6635556519031525,
}

const ExploreMap = () => {
  const mapRef = useRef()
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const PARAMS_VALUE = useSelector((state) => state.ROUTEPARAMS);
  const REDUXUSER = useSelector((state) => state.AUTHUSER)
  const REDUXIP = useSelector((state) => state.IPADDRESS)
  const REDUXALERT = useSelector((state) => state.REDUXALERT)
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION)
  const [foreground, requestForeground] = Location.useForegroundPermissions()

  const [iniRegion, setIniRegion] = useState({})
  const [places, setPlaces] = useState([])
  const [posts, setPosts] = useState([])
  const [displayLabel, setDisplayLabel] = useState([])
  const [isUnmounted, setIsUnmounted] = useState(false)
  const [selectedPost, setSelectedPost] = useState({})
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [mapType, setMapType] = useState("standard")
  const [showAlert, setShowAlert] = useState(false);
  const [initialBsIndex, setIntialBsIndex] = useState(-1);
  const [forceRender, setForceRender] = useState(false);
  const [tRightCoords, setTRightCoord] = useState({})
  const [tLeftCoords, setTLeftCoord] = useState({})
  const [tCenterCoords, setTCenterCoord] = useState({})
  const [rCenterCoords, setRCenterCoord] = useState({})
  const [bCenterCoords, setBCenterCoord] = useState({})
  const [lCenterCoords, setLCenterCoord] = useState({})
  const [bRightCoords, setBRightCoord] = useState({})
  const [bLeftCoords, setBLeftCoord] = useState({})
  const [centerCoords, setCenterCoord] = useState({})
  const [lngDelta, setLngDelta] = useState({})
  const [latDelta, setLatDelta] = useState({})
  const [currentPostBSIndex, setCurrentPostBSIndex] = useState(0)
  const [prevPostBSIndex, setPrevPostBSIndex] = useState(0)
  const [showPostMarkers, setShowPostMarkers] = useState(true)
  // const [showMapControl, setShowMapControl] = useState(true)
  const [myLocation, setMyLocation] = useState({})
  const [fetchingPosition, setFetchingPosition] = useState(false)
  const [showLocationInfoModal, setShowLocationInfoModal] = useState(false);
  const [showInactiveMarker, setShowInactiveMaker] = useState(false)
  const bottomSheetRef = useRef(null)
  const postBottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => (height < 800 ? ["36.5%"] : ["31.5%"]), [])
  const postSnapPoints = useMemo(
    () => (height < 800 ? ["8%", "50%", "110%"] : ["7%", "50%", "110%"]),
    []
  )

  const [exploreMapPlaces, { data, error, isLoading, isSuccess, isError }] =
    useExploreMapPlacesMutation()

  const [
    exploreMapPost,
    { data: postData, isSuccess: postIsSuccess, isError: postIsError },
  ] = useExploreMapPostMutation()

  const [
    exploreMapPostDetails,
    {
      data: postDetailsData,
      isLoading: postDetailsIsLoading,
      isError: postDetailsIsError,
      isSuccess: postDetailsIsSuccess,
      error: postDetailsError,
    },
  ] = useExploreMapPostDetailsMutation()

  useBackHandler(() => {
    if(isUnmounted) return false;
    setShowInactiveMaker(false);
    if (currentPostBSIndex !== 0) {
      closeBottomPostSheet()
    } else if (selectedPost?._id) {
      clearInitialParams()
      // setShowMapControl(true)
      setSelectedPost({})
      bottomSheetRef.current.close()
    } else {
      clearInitialParams()
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home Navigation" }],
        })
      }
    }
    return true

  });

  const findIpLocation = async () => {
    try {
      const ipLocation = await getIpLocation()
      if (ipLocation.status === 200) {
        const userLocation = {
          latitude: ipLocation?.data?.latitude,
          longitude: ipLocation?.data?.longitude,
          ...DELTAS,
        }
        setIniRegion({ region: userLocation })
      } else {
        setIniRegion({ region: INDIA_COORDS })
      }
    } catch (err) {
      setIniRegion({ region: INDIA_COORDS })
    }
    return
  }

  const clearInitialParams = () => {
    if (
      PARAMS_VALUE &&
      PARAMS_VALUE?.coordinates &&
      PARAMS_VALUE?.coordinates?.latitude
      ) {
      dispatch(removeRouteParams())
    }
  }


  useFocusEffect(
    useCallback(() => {
      if (
        PARAMS_VALUE?.post &&
        PARAMS_VALUE?.post?._id &&
        PARAMS_VALUE?.coordinates &&
        PARAMS_VALUE?.coordinates?.latitude &&
        PARAMS_VALUE?.coordinates?.longitude &&
        iniRegion?.region?.longitude
      ) {
        const userLocation = {
          latitude: parseFloat(PARAMS_VALUE?.coordinates?.latitude),
          longitude: parseFloat(PARAMS_VALUE?.coordinates?.longitude),
          ...RECENTER_DELTAS,
        }
        if (PARAMS_VALUE?.post?._id) {
          setShowInactiveMaker(true)
        }
        mapRef.current.animateToRegion(userLocation, 500)
        setFetchingPosition(false)
        setSelectedPost(PARAMS_VALUE?.post)
        // setShowMapControl(false)
        bottomSheetRef.current?.snapToIndex(0)
        postBottomSheetRef.current?.snapToIndex(0)
        exploreMapPostDetails({
          token: REDUXUSER.token,
          postId: PARAMS_VALUE?.post?._id,
        })
      }
    }, [PARAMS_VALUE])
  )

  useEffect(() => {
    (async () => {
      setIsUnmounted(false)
      if (
        PARAMS_VALUE?.post &&
        PARAMS_VALUE?.post?._id &&
        PARAMS_VALUE?.coordinates &&
        PARAMS_VALUE?.coordinates?.latitude &&
        PARAMS_VALUE?.coordinates?.longitude
      ) {
        const userLocation = {
          latitude: parseFloat(PARAMS_VALUE?.coordinates?.latitude),
          longitude: parseFloat(PARAMS_VALUE?.coordinates?.longitude),
          ...RECENTER_DELTAS,
        }
        if (PARAMS_VALUE?.post?._id) {
          setShowInactiveMaker(true)
        }
        setIniRegion({ region: userLocation })
        setSelectedPost(PARAMS_VALUE?.post)
        // setShowMapControl(false)
        setIntialBsIndex(0)
        exploreMapPostDetails({
          token: REDUXUSER.token,
          postId: PARAMS_VALUE?.post?._id,
        })
        // bottomSheetRef.current?.snapToIndex(0)
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status == "granted") {
          let location = await Location.getCurrentPositionAsync({})
          let data = {}
          if (location?.coords?.latitude) {
            data = {
              lat: location?.coords.latitude,
              lng: location?.coords.longitude,
            }
            setMyLocation(data)
            dispatch(addCoords({ coords: data }));
          } else {
            let lastLocation = await Location.getLastKnownPositionAsync({})
            if (lastLocation?.coords?.latitude) {
              data = {
                lat: lastLocation?.coords.latitude,
                lng: lastLocation?.coords.longitude,
              }
              setMyLocation(data)
              dispatch(addCoords({ coords: data }));
            }
          }

          if (data?.lat && data?.lng) {
            const userLocation = {
              latitude: data?.lat,
              longitude: data?.lng,
              ...DELTAS,
            }
            setIniRegion({ region: userLocation })
          } else {
            await findIpLocation()
          }
        } else {
          await findIpLocation()
        }
      }
      return () => {
        setIsUnmounted(true)
      }
    })()
  }, [])


  //HIDE SHOW ALERT
  useEffect(() => {
    if (!isUnmounted && REDUXALERT.type == "savePost") {
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
        dispatch(clearAlert())
      }, 2000)
    }
  }, [REDUXALERT])

  const alertError = () => {
    if (!isUnmounted) {
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 2000)
    }
  }

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      //REQUEST POSTS
      if (latDelta < 3) {
        exploreMapPost({
          token: REDUXUSER.token,
          lngDelta: lngDelta,
          latDelta: latDelta,
          topLeftCoords: tLeftCoords,
          topRightCoords: tRightCoords,
          bottomRightCoords: bRightCoords,
          bottomLeftCoords: bLeftCoords,
          ip: REDUXIP,
        })
      } else {
        setPosts([])
      }

      setPlaces(data.places)
      setDisplayLabel(data.displayLabel)
    }
    if (isError && !isUnmounted) {
      setErrorMsg(
        error?.data?.message?.general ||
          "Opps! Something went wrong. Please try again."
      )
      alertError()
    }
  }, [isSuccess, isError])

  useEffect(() => {
    if (postIsSuccess && !isUnmounted) {
      setPosts(postData.posts)
    }
  }, [postIsSuccess, postIsError])

  const changeMapType = () => {
    if (mapType === "standard") {
      setMapType("satellite")
    } else {
      setMapType("standard")
    }
  }

  //Force Rerender
  const rerenderParent = () => setForceRender(prev => !prev);

  const onMarkerPressed = useCallback((place) => {
    clearInitialParams();
    navigation.navigate(`Place via ${REDUXNAVIGATION.name}`, {
      place_id: place?._id,
    });
  }, [])

  useEffect(() => {
    if (postDetailsIsSuccess && !isUnmounted) {
      clearInitialParams();
      setSelectedPost(postDetailsData.post)
    }
  }, [postDetailsIsSuccess, postDetailsIsError])



  // useEffect(() => {
  //   if (placeIsSuccess && !isUnmounted) {
  //     setSelectedPlace(placeData.place)
  //   }
  // }, [placeIsSuccess, placeIsError])

  const onPressPostMarker = useCallback((post) => {
    clearInitialParams();
    // setShowMapControl(false);
    setShowInactiveMaker(false);
    setSelectedPost(post)
    postBottomSheetRef.current?.snapToIndex(0)
    bottomSheetRef.current?.expand()
    exploreMapPostDetails({
      token: REDUXUSER.token,
      postId: post._id,
    })
  }, [])

  const closeBottomSheet = useCallback(() => {
    clearInitialParams()
    // setShowMapControl(true)
    setShowInactiveMaker(false);
    // setSelectedPlace({})
    setSelectedPost({})
    bottomSheetRef.current?.close()
    postBottomSheetRef.current?.snapToIndex(0)
    setPrevPostBSIndex(0)
    setCurrentPostBSIndex(0)
  }, [])

  const openPostBottomsheet = useCallback(() => {
    if (currentPostBSIndex == 0) {
      setCurrentPostBSIndex((prev) => {
        setPrevPostBSIndex(prev)
        return 1
      })
      postBottomSheetRef.current?.snapToIndex(1)
    }
  }, [])

  const closeBottomPostSheet = useCallback(() => {
    if (currentPostBSIndex !== 0) {
      const newIndex = currentPostBSIndex - 1
      setCurrentPostBSIndex((prev) => {
        setPrevPostBSIndex(prev)
        return newIndex
      })
      postBottomSheetRef.current?.snapToIndex(newIndex)
    }
  }, [currentPostBSIndex, prevPostBSIndex])

  const handlePostBottomSheetChange = useCallback((index) => {
    setCurrentPostBSIndex((prev) => {
      setPrevPostBSIndex(prev)
      return index
    })
  }, [])

  const onRegionChange = useCallback((region) => {
    const topLeftCoords = {
      latitude: region.latitude + region.latitudeDelta / 2.25,
      longitude: region.longitude - region.longitudeDelta / 2.2,
    }

    const topRightCoords = {
      latitude: region.latitude + region.latitudeDelta / 2.25,
      longitude: region.longitude + region.longitudeDelta / 2.2,
    }

    const bottomRightCoords = {
      latitude: region.latitude - region.latitudeDelta / 2.4,
      longitude: region.longitude + region.longitudeDelta / 2.2,
    }

    const bottomLeftCoords = {
      latitude: region.latitude - region.latitudeDelta / 2.4,
      longitude: region.longitude - region.longitudeDelta / 2.2,
    }

    setTRightCoord(topRightCoords)
    setTLeftCoord(topLeftCoords)
    setBRightCoord(bottomRightCoords)
    setBLeftCoord(bottomLeftCoords)
    setLngDelta(region.longitudeDelta)
    setLatDelta(region.latitudeDelta)

    if (isUnmounted) return
    setIniRegion({ region })
    exploreMapPlaces({
      token: REDUXUSER.token,
      lngDelta: region.longitudeDelta,
      latDelta: region.latitudeDelta,
      topLeftCoords,
      topRightCoords,
      bottomRightCoords,
      bottomLeftCoords,
      ip: REDUXIP,
    })

    // const topLeftCoords = {
    //   latitude: region.latitude + region.latitudeDelta / 10,
    //   longitude: region.longitude - region.longitudeDelta / 4,
    // }

    // const topCenterCoords = {
    //   latitude: region.latitude + region.latitudeDelta / 7,
    //   longitude: region.longitude,
    // }

    // const topRightCoords = {
    //   latitude: region.latitude + region.latitudeDelta / 10,
    //   longitude: region.longitude + region.longitudeDelta / 4,
    // }

    // const rightCenterCoords = {
    //   latitude: region.latitude,
    //   longitude: region.longitude + region.longitudeDelta / 3.5,
    // }

    // const bottomRightCoords = {
    //   latitude: region.latitude - region.latitudeDelta / 10,
    //   longitude: region.longitude + region.longitudeDelta / 4,
    // }

    // const bottomCenterCoords = {
    //   latitude: region.latitude - region.latitudeDelta / 7,
    //   longitude: region.longitude,
    // }

    // const bottomLeftCoords = {
    //   latitude: region.latitude - region.latitudeDelta / 10,
    //   longitude: region.longitude - region.longitudeDelta / 4,
    // }

    // const leftCenterCoords = {
    //   latitude: region.latitude,
    //   longitude: region.longitude - region.longitudeDelta / 3.5,
    // }

    // setTRightCoord(topRightCoords)
    // setTLeftCoord(topLeftCoords)
    // setBRightCoord(bottomRightCoords)
    // setBLeftCoord(bottomLeftCoords)
    // setTCenterCoord(topCenterCoords)
    // setRCenterCoord(rightCenterCoords)
    // setBCenterCoord(bottomCenterCoords)
    // setLCenterCoord(leftCenterCoords)
    // setLngDelta(region.longitudeDelta)
    // setLatDelta(region.latitudeDelta)
    // setCenterCoord({ latitude: region.latitude, longitude: region.longitude })
  }, [])

  const recenterToPosition = async () => {
    setFetchingPosition(true)
    const permission = await Location.requestForegroundPermissionsAsync()

    if (!foreground && permission.status === "denied") {
      setFetchingPosition(false)
      return
    } else if (!permission.granted && !permission.canAskAgain) {
      setShowLocationInfoModal(true)
      setFetchingPosition(false)
    } else {
      let location = await Location.getCurrentPositionAsync({})
      let data = {}
      if (location?.coords?.latitude) {
        data = {
          lat: location?.coords.latitude,
          lng: location?.coords.longitude,
        }
        setMyLocation(data)
      } else {
        let lastLocation = await Location.getLastKnownPositionAsync({})
        if (lastLocation?.coords?.latitude) {
          data = {
            lat: lastLocation?.coords.latitude,
            lng: lastLocation?.coords.longitude,
          }
          setMyLocation(data)
        }
      }

      const region = {
        latitude: data.lat,
        longitude: data.lng,
        ...RECENTER_DELTAS,
      }

      mapRef.current.animateToRegion(region, 500)
      setFetchingPosition(false)
    }
  }

  const closeLocationInfoModal = () => {
    setFetchingPosition(false)
    setShowLocationInfoModal(false)
  }
  const showSetting = () => {
    setShowLocationInfoModal(false)
    requestForeground().then((p) => !p.granted && Linking.openSettings())
  }

  if (!iniRegion?.region?.latitude || !iniRegion?.region?.longitude) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.buttonContainer}>
          <Text>Loading...</Text>
        </View>
      )}
      {!isLoading && showError && (
        <View style={styles.buttonContainer}>
          <Text>{errorMsg}</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        onPress={closeBottomSheet}
        showsCompass={true}
        toolbarEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
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

        {/* {tCenterCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={tCenterCoords}
        >
          <View style={{ height: 5, width: 5, backgroundColor: "blue" }} />
        </Marker>}


        {tCenterCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={rCenterCoords}
        >
          <View style={{ height: 5, width: 5, backgroundColor: "black" }} />
        </Marker>}

        {tCenterCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={bCenterCoords}
        >
          <View style={{ height: 5, width: 5, backgroundColor: "red" }} />
        </Marker>}


        {tCenterCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={lCenterCoords}
        >
          <View style={{ height: 5, width: 5, backgroundColor: "pink" }} />
        </Marker>}
        
        
        
        
        {tRightCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={tRightCoords}
        >
            <View style={{ height:5, width:5, backgroundColor:"orange" }} />
          </Marker>}
        {tLeftCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={tLeftCoords}
        >
            <View style={{ height:5, width:5, backgroundColor:"yellow" }} />
          </Marker>}
        {tLeftCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={bRightCoords}
        >
            <View style={{ height:5, width:5, backgroundColor:"green" }} />
          </Marker>}
        {tLeftCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={bLeftCoords}
        >
            <View style={{ height:5, width:5, backgroundColor:"white" }} />
          </Marker>}

        {tLeftCoords.latitude && <Marker
          tracksViewChanges={false}
          coordinate={centerCoords}
        >
            <View style={{ height:5, width:5, backgroundColor:"grey" }} />
          </Marker>} */}



        {myLocation?.lat && myLocation?.lng && (
          <Marker
            key={`${myLocation?.lat}_${myLocation?.lng}`}
            tracksViewChanges={false}
            zIndex={500}
            coordinate={{
              latitude: parseFloat(myLocation.lat),
              longitude: parseFloat(myLocation.lng),
            }}
          >
            <View
              style={{
                width: 25,
                height: 25,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                borderRadius: 25 / 2,
              }}
            >
              <RadialGradient
                style={styles.myPositionContainer}
                colors={["rgba(228, 85, 39, 0.8)", "rgba(228, 85, 39, 0.1)"]}
                stops={[0.5, 1]}
                // radius={25}
              >
                <View style={styles.myPosition} />
              </RadialGradient>
            </View>
          </Marker>
        )}

        {places.length > 0 &&
          places.map((place) => (
            <Marker
              key={place._id}
              tracksViewChanges={false}
              zIndex={100}
              pinColor={"#fff"}
              onPress={() => onMarkerPressed(place)}
              coordinate={{
                latitude: place?.location?.coordinates[1],
                longitude: place?.location?.coordinates[0],
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  position: "relative",
                  height: 38,
                  width: 38,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="chatbubble-sharp"
                  style={{
                    fontSize: 29,
                    color: "#456a90",
                    transform: [{ rotate: "-40deg" }],
                  }}
                />

                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    style={{
                      fontSize: 29,
                      color: "#000",
                      transform: [{ rotate: "-40deg" }],
                    }}
                  />
                </View>
              </View>
            </Marker>
          ))}

        {displayLabel.length > 0 &&
          places.length > 0 &&
          places.map((place) => (
            <View key={`${place._id}_${place?.name}`}>
              {displayLabel.includes(place?._id) && (
                <Marker
                  key={`${place._id}_${place?.name}`}
                  pinColor={"#fff"}
                  zIndex={100}
                  tracksViewChanges={false}
                  anchor={{ x: 0.5, y: 0 }}
                  coordinate={{
                    latitude: place?.location?.coordinates[1],
                    longitude: place?.location?.coordinates[0],
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      maxWidth: 140,
                      elevation: 8,
                      padding: 2,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        textShadowColor: "#fff",
                        fontWeight: "bold",
                        textShadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 1,
                        textShadowRadius: 2,
                      }}
                    >
                      {place?.display_name || place?.name}
                    </Text>
                  </View>
                </Marker>
              )}
            </View>
          ))}

        <>
          {showPostMarkers &&
            posts.length > 0 &&
            posts.map((post) => (
              <PostMarker
                key={post._id}
                post={post}
                onMarkerPressed={onPressPostMarker}
                selectedPost={selectedPost}
                rerenderParent={rerenderParent}
                mapType={mapType}
              />
            ))}
        </>

        {/* {showInactiveMarker && ( */}
        {selectedPost?._id && (
          <Marker
            key={selectedPost?._id}
            tracksViewChanges={false}
            pinColor={"#fff"}
            zIndex={200}
            coordinate={{
              latitude: selectedPost?.content[0]?.location.coordinates[1],
              longitude:
                selectedPost?.content[0]?.location.coordinates[0],
            }}
          >
            <>
              <Image
                source={require("../../assets/images/postselected.png")}
                style={styles.image}
                onLoad={() => rerenderParent()}
              />
              <Text style={styles.textStyle}>{Math.random()}</Text>
            </>
          </Marker>
        )}
      </MapView>
      {/* setShowPostMarkers */}
      {/* {showMapControl && (
        <> */}
          <View
            style={{
              position: "absolute",
              top: 100,
              right: 12,
            }}
          >
            <TouchableOpacity
              style={[styles.mapTypeButton, { backgroundColor: "#fff" }]}
              disabled={fetchingPosition}
              onPress={recenterToPosition}
            >
              <MaterialIcons
                name="my-location"
                size={20}
                color={fetchingPosition ? COLORS.foiti : "#000"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mapTypeButton,
                {
                  backgroundColor: showPostMarkers ? "#fff" : COLORS.foitiGrey,
                  position: "relative",
                },
              ]}
              onPress={() => setShowPostMarkers((prev) => !prev)}
            >
              <MaterialCommunityIcons
                name="image-filter-center-focus-strong"
                size={20}
                color={showPostMarkers ? "#000" : "#fff"}
              />
              <View
                style={{
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <FontAwesome5
                  name="slash"
                  size={18}
                  color={showPostMarkers ? "#000" : "#fff"}
                  style={{ transform: [{ rotate: "80deg" }] }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mapTypeButton,
                {
                  backgroundColor:
                    mapType === "satellite" ? COLORS.foitiGrey : "#fff",
                },
              ]}
              onPress={changeMapType}
            >
              <FontAwesome5
                name="satellite"
                size={20}
                color={mapType === "satellite" ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
        {/* </>
      )} */}
      
      {latDelta >= 3 && (
        <View style={styles.zoomTextContainer}>
          <View style={styles.zoomTextBox}>
            <Text>Zoom in to explore</Text>
          </View>
        </View>
      )}
      <BottomSheet
        ref={bottomSheetRef}
        // index={-1}
        index={initialBsIndex}
        snapPoints={snapPoints}
        enableContentPanningGesture={false}
        style={{ padding: 15 }}
        backgroundComponent={null}
        handleIndicatorStyle={{ display: "none" }}
      >
        {/* <BottomSheetContainer
          place={selectedPlace}
          closeBottomSheet={closeBottomSheet}
          loading={placeIsLoading}
        /> */}
        <PostBottomSheetContainer
          post={selectedPost}
          closeBottomSheet={closeBottomSheet}
          loading={postDetailsIsLoading}
        />
      </BottomSheet>
      {latDelta < 3 && (
        <BottomSheet
          ref={postBottomSheetRef}
          index={0}
          snapPoints={postSnapPoints}
          enableContentPanningGesture={
            latDelta < 3 && currentPostBSIndex !== 2 ? true : false
          }
          enableHandlePanningGesture={latDelta > 3 ? false : true}
          overDragResistanceFactor={10}
          style={{
            paddingHorizontal: 5,
            paddingVertical: 0,
          }}
          enableOverDrag={false}
          backgroundComponent={(props) => (
            <BottomSheetBackground
              {...props}
              currentPostBSIndex={currentPostBSIndex}
            />
          )}
          handleIndicatorStyle={{
            width: 40,
            backgroundColor: COLORS.foitiGreyLight,
            display: currentPostBSIndex === 2 ? "none" : "flex",
          }}
          onChange={handlePostBottomSheetChange}
        >
          <MapExplorePost
            currentPostBSIndex={currentPostBSIndex}
            prevPostBSIndex={prevPostBSIndex}
            topLeftCoords={tLeftCoords}
            topRightCoords={tRightCoords}
            bottomLeftCoords={bLeftCoords}
            bottomRightCoords={bRightCoords}
            latDelta={latDelta}
            isUnmounted={isUnmounted}
            closeBottomSheet={closeBottomPostSheet}
            openPostBottomsheet={openPostBottomsheet}
          />
        </BottomSheet>
      )}
      <NearbyInfoModal
        modalVisible={showLocationInfoModal}
        closeModal={closeLocationInfoModal}
        showSetting={showSetting}
        goBack={closeLocationInfoModal}
        body="Location permission is required to see your current location"
      />
      {showAlert && <CustomAlert text={REDUXALERT?.message} />}
    </View>
  )
}

const BottomSheetBackground = ({ style, currentPostBSIndex }) => {
  return (
    <View
      style={[
        {
          backgroundColor: "white",
          borderRadius: currentPostBSIndex === 2 ? 0 : 25,
        },
        { ...style },
      ]}
    />
  )
}

export default ExploreMap

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  buttonContainer: {
    top: 30,
    position: "absolute",
    zIndex: 10,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: COLORS.foitiGreyLighter,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 10,
  },
  zoomTextContainer: {
    position: "absolute",
    width,
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomTextBox: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  mapTypeButton: {
    marginBottom: 15,
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
  textStyle: {
    height: 0,
    width: 0,
  },
  image: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    zIndex: 20,
  },
  myPositionContainer: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"rgba(228, 85, 39, 0.3)",
    borderRadius: 25 / 2,
  },
  myPosition: {
    height: 13,
    width: 13,
    backgroundColor: COLORS.foiti,
    borderWidth: 1.5,
    borderColor: "white",
    borderRadius: 13 / 2,
  },
})
