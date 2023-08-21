import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { COLORS } from "../resources/theme";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import * as Location from "expo-location";
import { useSearchPlaceQuery } from "../Redux/services/serviceApi";
import axios from "axios";
import { addPlaceData, removePlaceData } from "../Redux/slices/addPlaceSlice";
import { useBackHandler } from "@react-native-community/hooks";
import ModalComponent from "../components/ModalComponent";
import { searchApi } from "../Redux/customApis/api";
const { width, height } = Dimensions.get("screen");

const CreatePlace = () => {
  const REDUXDATA = useSelector((state) => state.NEWPLACE);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  //STATES
  const [placeName, setPlaceName] = useState("");
  const [addSelected, setAddSelected] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [imageAddress, setImageAddress] = useState({});
  const [suggestionAddress, setSuggestionAddress] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState([]);
  const [unMounted, setUnMounted] = useState(false);

  //Back handle
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

  const handleBackArrow = () => {
    if (navigation.canGoBack()) {
      navigation.navigate("New Post");
    } else {
      navigation.navigate("Home Navigation");
    }
  };

  //STRUCTURE DETAILS FETCH FROM GOOGLE PLACES API;
  const getStructuredDetails = (place) => {
    let addressComponent = {};
    place?.address_components?.map((address) => {
      addressComponent[address.types[0]] = address.long_name;
      if (address.types[0] == "country") {
        addressComponent["short_country"] = address.short_name;
      }
    });

    const details = {
      place_id: place.place_id,
      fullAddress: place.formatted_address,
      types: place.types,
      address: addressComponent,
      // coordinates: place.geometry.location,
      coordinates: {
        lat: REDUXDATA?.images[0]?.coordinates?.lat,
        lng: REDUXDATA?.images[0]?.coordinates?.lng
      },
    };

    return details;
  };

  useEffect(() => {
    setUnMounted(false);
    (async () => {
      if (REDUXDATA?.images[0]?.coordinates?.lat !== null) {
        fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            REDUXDATA?.images[0]?.coordinates?.lat +
            "," +
            REDUXDATA?.images[0]?.coordinates?.lng +
            "&key=" +
            process.env.GOOGLE_PLACES_API
        )
          .then((response) => response.json())
          .then((responseJson) => {
            const imageAddress = getStructuredDetails(responseJson.results[0]);

            setImageAddress(imageAddress);
          });
      }
    })();

    return () => {
      setUnMounted(true);
    };
  }, []);

  //HANDLE SUGGESTION PRESS
  const suggestionPress = (index) => {
    const selectedData = response[index];
    if (selectedData != null) {
      setPlaceName(selectedData.name);
      const details = {
        place_id: selectedData.google_place_id,
        types: selectedData.types,
        address: selectedData.address,
        coordinates: selectedData.coordinates,
      };
      setSuggestionAddress(details);
      setAddSelected(true);
    }
  };

  const handleTextChange = useCallback(
    debounce(async function (text) {
      const body = {
        text,
        token: REDUXUSER.token,
      };
      if (text.length > 0) {
        const api = await searchApi(body);
        if (!unMounted) setResponse(api.results);
      } else {
        if (!unMounted) setResponse([]);
      }
    }, 500),
    []
  );

  useState(() => {
    if (response.length > 0 && placeName.length > 0) {
      if (placeName.length > 0) {
        setAddSelected(true);
      } else {
        setAddSelected(false);
      }
    } else {
      setAddSelected(false);
    }
  }, [response, placeName]);

  //CREATING NEW POST ON PRESS ADD POST
  const handleAddPlace = () => {
    if (placeName.length > 0) {
      if (imageAddress?.place_id) {
        imageAddress.name = placeName;
        imageAddress.created_place = true;
        dispatch(addPlaceData({ ...imageAddress }));
        navigation.navigate("New Post");
      } else {
        setModalVisible(true);
      }
    } else {
      setErrorMsg("Please enter a place name");
    }
  };

  //HANDLE ON PRESS CREATE NEW POST
  const handleCreatePlace = () => {
    if (placeName.length > 0) {
      if (suggestionAddress?.place_id) {
        suggestionAddress.name = placeName;
        suggestionAddress.created_place = false;
        dispatch(addPlaceData({ ...suggestionAddress }));
        navigation.navigate("New Post");
      } else {
        setModalVisible(true);
      }
    } else {
      setErrorMsg("Please enter a place name");
    }
  };

  //HANDLE MODAL VISIBILITY
  const closeModal = () => {
    setModalVisible(false);
    dispatch(removePlaceData());
    navigation.navigate("New Post");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderBottomColor: COLORS.foitiGreyLight,
          borderBottomWidth: 0.5,
        }}
      >
        <Pressable onPress={handleBackArrow}>
          <Ionicons name="md-arrow-back" style={styles.icon} />
        </Pressable>
        <Text
          numberOfLines={1}
          style={{
            marginLeft: 10,
            fontSize: 18,
            fontWeight: "bold",
            color: "#000",
          }}
        >
          Add A New PLace
        </Text>
      </View>
      <View style={styles.mainContainer}>
        <Text style={{ fontSize: 18, marginBottom: 10, textAlign: "center" }}>
          What's The Name of The Place?
        </Text>
        <View>
          <TextInput
            placeholder="Enter Name"
            style={styles.textInput}
            value={placeName}
            onChangeText={(text) => {
              setErrorMsg("");
              setPlaceName(text);
              setAddSelected(false);
              handleTextChange(text);
            }}
          />
          <Text style={{ textAlign: "center", color: "red", fontSize: 12 }}>
            {errorMsg}
          </Text>
        </View>
        <View>
          <View style={styles.resultContainer}>
            {response.length > 0 && placeName.length > 0 && (
              <View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={{ color: COLORS.foitiGrey, fontSize: 12 }}>
                    Suggestions
                  </Text>
                </View>
                <View style={styles.separator} />
                {response.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => suggestionPress(index)}
                  >
                    <View style={styles.suggestionContainer}>
                      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      {item.address.country != undefined && (
                        <Text>
                          {item.address.administrative_area_level_1 ||
                            item.address.administrative_area_level_2 ||
                            item.address.locality}
                          , {item.address.country}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={{ alignItems: "center" }}>
            {addSelected ? (
              <TouchableOpacity
                style={styles.addPlace}
                onPress={handleCreatePlace}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Continue
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addPlace}
                onPress={handleAddPlace}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Add Place
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ModalComponent
        body="Something went wrong adding place. Please try again."
        closeModal={closeModal}
        modalVisible={modalVisible}
        hasButton={true}
      />
    </ScrollView>
  );
};

export default CreatePlace;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.2,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  icon: {
    fontSize: 28,
    color: COLORS.foitiGrey,
  },
  mainContainer: {
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 0.8,
    borderColor: COLORS.foitiGrey,
    paddingHorizontal: 3,
    paddingVertical: 5,
    textAlign: "center",
    borderRadius: 5,
    marginVertical: 5,
  },
  suggestionTextContainer: {
    paddingVertical: 5,
  },
  separator: {
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.6,
    width: "70%",
  },
  suggestionContainer: {
    paddingVertical: 5,
  },
  resultContainer: {
    // backgroundColor: "green",
    height: 300,
  },
  addPlace: {
    backgroundColor: COLORS.foiti,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
