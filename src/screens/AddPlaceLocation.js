import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { COLORS } from "../resources/theme";
import { Ionicons, Feather } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_PLACES_API } from "@env";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlaceData,
  removePlaceData,
  updatePlaceData,
} from "../Redux/slices/addPlaceSlice";
import { addAddress } from "../Redux/slices/addAddressSlice";
import { useBackHandler } from "@react-native-community/hooks";
import { useAddCurrentLocationMutation } from "../Redux/services/serviceApi";
import { addDestination } from "../Redux/slices/addDestinationSlice";
import { addTravelFrom } from "../Redux/slices/addTravellingSlice";

const { width, _ } = Dimensions.get("screen");

const SuggestionRow = ({ item }) => {
  let arr = item.description.split(",");
  let otherText = arr.slice(1);
  const newText = otherText.join(",");
  return (
    <View style={{ width: width - 40 }}>
      <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
        {arr[0]}
      </Text>
      <Text numberOfLines={1} style={{ color: COLORS.foitiGrey }}>
        {newText.trim()}
      </Text>
    </View>
  );
};

const AddPlaceLocation = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXDATA = useSelector((state) => state.NEWPLACE);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [prevScreen, setPrevScreen] = useState("");
  const [options, setOptions] = useState({});
  const refInput = useRef(null);
  const [percent, setPercent] = useState(0);
  const [addCurrentLocation, { data }] = useAddCurrentLocationMutation();

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
    return true;
  });

  useLayoutEffect(() => {
    setPrevScreen(route.params?.prev_screen);
    if (route.params?.prev_screen === "addAddress" || route.params?.prev_screen === "addCurrentAddress") {
      setOptions({
        key: `${GOOGLE_PLACES_API}`,
        language: "en",
        types: "(cities)",
      });
    }else if (route.params?.prev_screen === "addDestination" || route.params?.prev_screen === "addTravel") {
      setOptions({
        key: `${GOOGLE_PLACES_API}`,
        language: "en",
        types: "(regions)",
      });
    // } else if (route.params?.prev_screen === "addCurrentAddress") {
    //   setOptions({
    //     key: `${GOOGLE_PLACES_API}`,
    //     language: "en",
    //     types: "(cities)",
    //   });
    } else {
      if (
        REDUXDATA?.images[0]?.coordinates.lat === "" ||
        REDUXDATA.images.length === 0
      ) {
        setOptions({
          key: `${GOOGLE_PLACES_API}`,
          language: "en",
        });
      } else {
        setOptions({
          key: `${GOOGLE_PLACES_API}`,
          language: "en",
          location: `${REDUXDATA?.images[0].coordinates.lat}, ${REDUXDATA?.images[0]?.coordinates?.lng}`,
          radius: "300000", //300 km
          rankby: "distance",
          strictbounds: true,
        });
      }
    }
  }, []);

  const handleOnNotFound = () => {
    dispatch(removePlaceData());
    navigation.reset({
      index: 0,
      routes: [{ name: "Home Navigation" }],
    });
  };

  const handleAddNewPlace = () => {
    navigation.navigate("Create Place");
  };

  const renderNotFound = () => {
    return (
      <View style={{ paddingTop: 10 }}>
        {REDUXDATA?.images[0]?.coordinates?.lat !== "" &&
          route.params?.prev_screen == "addNewPost"  ? (
          <TouchableOpacity onPress={handleAddNewPlace}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="plus-circle" size={20} color={COLORS.foitiGrey} />
              <Text
                style={{ color: COLORS.foitiGrey, fontSize: 16, marginLeft: 5 }}
              >
                Add A New Place
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text>No result found</Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.headerConatiner}>
        <View style={{ flex: 1, marginTop: -3 }}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            isRowScrollable={false}
            minLength={2}
            debounce={300}
            ref={refInput}
            autoFocus={true}
            textInputProps={{
              placeholderTextColor: "#fff",
            }}
            styles={{
              textInputContainer: {
                marginLeft: 20,
                width: width - 60,
                height: 38,
                paddingLeft: 25,
                marginBottom: 20,
              },
              placeholderTextColor: { color: "#fff" },
              textInput: {
                height: 38,
                color: "#fff",
                fontSize: 14,
                backgroundColor: "#878787",
              },
              row: {
                backgroundColor: "#FFFFFF",
                paddingVertical: 10,
                // height: 50,
                flexDirection: "row",
              },
              separator: {
                height: 0,
                backgroundColor: "#c8c7cc",
              },
              loader: {
                flexDirection: "row",
                justifyContent: "flex-end",
                height: 20,
              },
            }}
            listEmptyComponent={renderNotFound}
            onNotFound={handleOnNotFound}
            onPress={(data, details = null) => {
              let addressComponent = {};
              if (details != null) {
                details.address_components.map((address) => {
                  addressComponent[address.types[0]] = address.long_name;
                  if (address.types[0] == "country") {
                    addressComponent["short_country"] = address.short_name;
                  }
                });

                const newPlace = {
                  name: details?.name,
                  place_id: details?.place_id,
                  fullAddress: details?.formatted_address,
                  types: details?.types,
                  address: addressComponent,
                  coordinates: details?.geometry.location,
                  timing: details?.opening_hours?.weekday_text,
                  phone_number: details?.formatted_phone_number,
                };
                if (prevScreen == "addAddress") {
                  dispatch(
                    addAddress({
                      name: details?.name || "",
                      administrative_area_level_1: addressComponent?.administrative_area_level_1 || "",
                      country: addressComponent?.country || "",
                      short_country: addressComponent?.short_country || "",
                      coordinates: details?.geometry.location,
                    })
                  );
                  dispatch(addPlaceData({ ...newPlace }));
                  }else if (prevScreen == "addDestination") {
                  dispatch(
                    addDestination({
                      place_id: details?.place_id,
                      name: details?.name || "",
                      administrative_area_level_1: addressComponent?.administrative_area_level_1 || "",
                      country: addressComponent?.country || "",
                      short_country: addressComponent?.short_country || "",
                      coordinates: details?.geometry.location,
                      types: details?.types,
                      address: addressComponent,
                    })
                  );
                } else if (prevScreen == "addTravel") {
                  dispatch(
                    addTravelFrom({
                      name: details?.name || "",
                      administrative_area_level_1: addressComponent?.administrative_area_level_1 || "",
                      country: addressComponent?.country || "",
                      short_country: addressComponent?.short_country || "",
                      coordinates: details?.geometry.location,
                    })
                  );
                  // dispatch(addPlaceData({ ...newPlace }));
                } else if (prevScreen == "addCurrentAddress") {
                  const current_address = {
                    name: details?.name,
                    types: details?.types,
                    address: addressComponent,
                    coordinates: details?.geometry.location,
                    token: REDUXUSER.token,
                  };
                  addCurrentLocation(current_address);
                } else {
                  dispatch(addPlaceData({ ...newPlace }));
                }
              }

              navigation.goBack();
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            onFail={() => navigation.goBack()}
            onTimeout={() => navigation.goBack()}
            autoFillOnNotFound={true}
            query={options}
            renderRow={(item) => <SuggestionRow item={item} />}
          />
        </View>
      </View>
      <View style={styles.backContainer} />
      <Pressable
        style={styles.pressable}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("Home");
          }
        }}
      >
        <Ionicons name="md-arrow-back" style={styles.icon} />
      </Pressable>
    </View>
  );
};

export default AddPlaceLocation;

const styles = StyleSheet.create({
  headerConatiner: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backContainer: {
    width,
    position: "absolute",
    top: 35,
    left: 0,
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // zIndex: 2,
  },
  pressable: {
    position: "absolute",
    top: 13,
    left: 13,
  },
  icon: {
    fontSize: 28,
    color: COLORS.foitiGrey,
  },
});
