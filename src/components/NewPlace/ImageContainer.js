import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  // Image,
} from "react-native";
import Image from "react-native-scalable-image";
import AutoHeightImage from "react-native-auto-height-image";
import React, { useEffect, useState } from "react";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS, FOITI_CONTS } from "../../resources/theme";

const { width, height } = Dimensions.get("screen");

const ImageContainer = ({ error }) => {
  const [locationSelected, setLocatonSelected] = useState(false);
  const navigation = useNavigation();
  const REDUXDATA = useSelector((state) => state.NEWPLACE);

  const [imageUri, setImageUri] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");

  useEffect(() => {
    if (REDUXDATA.images.length > 0) {
      setImageUri(REDUXDATA?.images[0]?.file.uri);
      setImageWidth(parseFloat(REDUXDATA?.images[0]?.width));
      setImageHeight(parseFloat(REDUXDATA?.images[0]?.height));
      if (
        REDUXDATA.coordinates != "" &&
        REDUXDATA.coordinates != undefined &&
        REDUXDATA.name != "" &&
        REDUXDATA.name != undefined
      ) {
        setLocatonSelected(true);
      } else {
        setLocatonSelected(false);
      }
    }
  }, [REDUXDATA]);

  const addLocation = () => {
    navigation.navigate("Add Place Location", { prev_screen: "addNewPost" });
  };
  return (
    <View>
      {imageWidth != "" && imageHeight != "" && (
        <View>
          <View style={{ width, backgroundColor: COLORS.foitiGreyLighter, overflow:"hidden" }}>
            <AutoHeightImage
              width={width}
              resizeMode="contain"
              source={{
                uri: imageUri,
              }}
              maxHeight={400}
            />
          </View>

          <View style={styles.addLocationContainer}>
            <TouchableOpacity style={styles.addLocation} onPress={addLocation}>
              {!locationSelected ? (
                <View
                  style={[styles.flexDisplay, { justifyContent: "flex-start" }]}
                >
                  <SimpleLineIcons name="location-pin" style={styles.icon} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    Name of the location{"     "}
                    {error && (
                      <Text
                        style={{
                          color: COLORS.foiti,
                          fontWeight: "normal",
                        }}
                      >
                        ({error})
                      </Text>
                    )}
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.flexDisplay,
                    { justifyContent: "space-between", spacing: 10 },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: width - 70,
                    }}
                  >
                    <SimpleLineIcons
                      name="location-pin"
                      style={{ color: "#fff", marginRight: 4 }}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        // fontWeight: "bold",
                      }}
                      numberOfLines={1}
                    >
                      {/* White Waterfall, Assam, India */}
                      {REDUXDATA.name}
                      {REDUXDATA.address?.administrative_area_level_1 != "" &&
                        REDUXDATA.address?.administrative_area_level_1 !=
                          undefined &&
                        REDUXDATA.types[0] != "administrative_area_level_1" &&
                        `, ${REDUXDATA.address?.administrative_area_level_1}`}
                      {REDUXDATA.types[0] != "country" &&
                        REDUXDATA.address?.country != undefined &&
                        `, ${REDUXDATA.address.country}`}
                    </Text>
                  </View>
                  <View>
                    <Feather
                      name="edit"
                      style={{ color: "#fff", fontSize: 13 }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ImageContainer;

const styles = StyleSheet.create({
  flexDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  addLocationContainer: {
    width: "100%",
    backgroundColor: COLORS.foitiGrey,
    paddingVertical: 14,
    // marginTop: 1,
  },
  addLocation: {
    paddingHorizontal: 15,
  },
  icon: {
    color: "#fff",
    fontSize: 16,
    marginRight: 5,
  },
  locationName: {
    marginTop: 600,
    paddingHorizontal: FOITI_CONTS.padding,
    width: "100%",
    backgroundColor: COLORS.foitiGreyLight,
  },
});
