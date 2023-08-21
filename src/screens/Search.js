import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useBackHandler } from "@react-native-community/hooks";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { COLORS } from "../resources/theme";
import { useSelector } from "react-redux";
import { placeAutocomplete } from "../Redux/customApis/api";
import * as Linking from "expo-linking";
import NearbyInfoModal from "../components/Nearby/NearbyInfoModal";
const { width, height } = Dimensions.get("screen");

const Search = () => {
  const navigation = useNavigation();
  const refInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [unMounted, setUnMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  //REDUXUSER
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [foreground, requestForeground] = Location.useForegroundPermissions();
  const [showNearbyInfoModal, setShowNearbyInfoModal] = useState(false);

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (REDUXNAVIGATION.name !== "home") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home Navigation" }],
        });
      } else {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    setUnMounted(false);
    // refInput.current.focus();
    return () => {
      setUnMounted(true);
    };
  }, []);

  const checkLocationPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!foreground && permission.status === "denied") {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home Navigation" }],
        });
      }
    } else if (!permission.granted && !permission.canAskAgain) {
      setShowNearbyInfoModal(true);
    } else {
      navigation.navigate("Nearby via home");
    }
  };

  const goBack = () => {
    setShowNearbyInfoModal(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
  };

  const showSetting = () => {
    setShowNearbyInfoModal(false);
    requestForeground().then((p) => !p.granted && Linking.openSettings());
  };

  const closeNearbyInfoModal = () => {
    setShowNearbyInfoModal(false);
  };

  //HANDLE TEXT CHANGE
  const handleTextChange = useCallback(
    debounce(async function (text) {
      const body = {
        text,
        token: REDUXUSER.token,
        ip: REDUXIP.ip,
      };
      if (text.length > 0) {
        const api = await placeAutocomplete(body);
        if (!unMounted) {
          setSearchResults(api.results);
          setUserResults(api.users);
        }
      } else {
        if (!unMounted) {
          setSearchResults([]);
          setUserResults([]);
        }
      }
      setIsLoading(false);
    }, 500),
    []
  );

  //HENDLE SEARCH REASULTS PRESSED
  const suggestionPress = (index) => {
    const result = searchResults[index];
    if (
      (result.types.length > 1 &&
        (result.types[1] == "Country" ||
          result.types[1] == "State" ||
          result.types[1] == "Union Territory")) ||
      result.destination
    ) {
      navigation.navigate(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: result._id });
    } else {
      navigation.navigate(`Place via ${REDUXNAVIGATION.name}`, { place_id: result._id });
    }
  };

  //Handle user clicked
  const userPressed = (index) => {
    navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, {
      userId: index,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.InputContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="md-chevron-back-sharp" style={{ fontSize: 25 }} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <TextInput
              autoFocus={true}
              ref={refInput}
              placeholder="Search"
              placeholderTextColor="#fff"
              style={styles.input}
              value={searchText}
              onChangeText={(text) => {
                setIsLoading(true);
                setSearchText(text);
                handleTextChange(text);
              }}
            />
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
              >
                <ActivityIndicator size="small" color={COLORS.foitiGrey} />
              </View>
            ) : (
              <View>
                {/* COUNTRYS */}
                {searchText.length === 0 && (
                  <View>
                    <TouchableOpacity
                      onPress={checkLocationPermission}
                      style={styles.nearButton}
                    >
                      <View style={styles.nearIcon}>
                        <MaterialIcons name="near-me" size={25} color="black" />
                      </View>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        Explore what's nearby
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {searchResults.length > 0 || userResults.length > 0 ? (
                  <>
                    {searchResults.length > 0 && (
                      <View>
                        <Text style={styles.header}>Places</Text>
                        {searchResults.map((item, index) => {
                          const formatedAddress =
                            item?.short_address || item?.local_address;
                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "flex-start",
                              }}
                            >
                              <TouchableOpacity
                                style={styles.placeTouchable}
                                onPress={() => suggestionPress(index)}
                              >
                                {item?.cover_photo != undefined &&
                                item?.cover_photo?.small?.private_id != "" ? (
                                  <Image
                                    source={{
                                      uri: `${process.env.BACKEND_URL}/image/${item.cover_photo.small.private_id}`,
                                    }}
                                    style={styles.thumbnail}
                                  />
                                ) : (
                                  <View
                                    style={[
                                      styles.thumbnail,
                                      styles.thumbnailBox,
                                    ]}
                                  >
                                    <Text
                                      style={{
                                        color: "#fff",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item.name[0]}
                                    </Text>
                                  </View>
                                )}
                                <View style={{ width: width - 90 }}>
                                  <Text
                                    style={{ fontWeight: "bold" }}
                                    numberOfLines={1}
                                  >
                                    {item?.name}
                                  </Text>
                                  {formatedAddress != undefined &&
                                    formatedAddress != "" && (
                                      <Text
                                        numberOfLines={1}
                                        style={{ fontSize: 12, lineHeight: 15 }}
                                      >
                                        {formatedAddress}
                                      </Text>
                                    )}
                                  {item?.types[1] && (
                                    <Text
                                      numberOfLines={1}
                                      style={{ fontSize: 12, lineHeight: 15 }}
                                    >
                                      {item?.types[1]}
                                    </Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    )}

                    {searchResults.length > 0 && userResults.length > 0 && (
                      <View style={styles.horLine} />
                    )}

                    {userResults.length > 0 && (
                      <View>
                        <Text style={styles.header}>Travellers</Text>
                        {userResults.map((item, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "flex-start",
                              }}
                            >
                              <TouchableOpacity
                                style={styles.placeTouchable}
                                onPress={() => userPressed(item._id)}
                              >
                                {item?.profileImage != undefined &&
                                item?.profileImage?.thumbnail?.private_id !=
                                  "" ? (
                                  <Image
                                    source={{
                                      uri: `${process.env.BACKEND_URL}/image/${item?.profileImage?.thumbnail?.private_id}`,
                                    }}
                                    style={styles.thumbnail}
                                  />
                                ) : (
                                  <Image
                                    source={{
                                      uri: `${process.env.BACKEND_URL}/image/profile_picture.jpg`,
                                    }}
                                    style={styles.thumbnail}
                                  />
                                )}
                                <View style={{ width: width - 90 }}>
                                  <Text
                                    style={{ fontWeight: "bold" }}
                                    numberOfLines={1}
                                  >
                                    {item?.name}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={{ fontSize: 12, lineHeight: 15 }}
                                  >
                                    {item.total_contribution} Contribution
                                    {item.total_contribution > 0 ? "s" : ""}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </>
                ) : (
                  <View>
                    {searchText.length > 0 && <Text>No results found</Text>}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <NearbyInfoModal
        modalVisible={showNearbyInfoModal}
        closeModal={closeNearbyInfoModal}
        showSetting={showSetting}
        goBack={goBack}
        body="Location permission is required to explore what's nearby"
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  InputContainer: {
    paddingVertical: 7,
    paddingHorizontal: 7,
  },
  input: {
    backgroundColor: "#878787",
    borderRadius: 18,
    padding: 5,
    paddingHorizontal: 18,
    color: "#fff",
  },
  placeTouchable: {
    paddingVertical: 7,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  thumbnailBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  horLine: {
    height: 1,
    backgroundColor: COLORS.foitiGreyLighter,
    marginVertical: 5,
  },
  header: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 15,
  },
  nearButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  nearIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
