import React, { memo, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { BACKEND_URL } from "@env";
import { COLORS } from "../../resources/theme";

const NearByPost = ({ item, onPress, showAddress = true, isHomeComponent=false }) => {
  // const [type, setType] = useState("");

  useEffect(() => {
    let splitType = "";
    if (item?.placeData?.types?.length > 0) {
      splitType = item?.placeData?.types[0].split("_");
    } else {
      splitType = item?.placeData?.google_types[0]?.split("_");
    }

    // const formatedType = splitType
    //   .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
    //   .join(" ");

    // setType(formatedType);
  }, [item]);
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => onPress(item._id)}>
        <View>
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri: `${BACKEND_URL}/image/${item?.content[0]?.image?.thumbnail?.private_id}`,
              }}
              style={[styles.image, isHomeComponent ? styles.imageHome : styles.imageDefault  ]}
            />
            <View style={styles.backDrop} />
          </View>
          <View style={[styles.locationName, isHomeComponent ? styles.homeLocation : styles.defaultLocation ]}>
            <View style={{ maxWidth: isHomeComponent ? (width - 170) / 2 : (width - 85)/2 }}>
                <Text
                numberOfLines={showAddress ? 1 : 2}
                style={{ fontSize: 11, fontWeight: isHomeComponent ? "normal" : "bold", color: "#000" }}
                >
                {item?.placeData?.name}
                </Text>
              {showAddress  && <Text numberOfLines={1} style={{ fontSize: 11, color: "#000" }}>
                  {item?.placeData.local_address ||
                    item?.placeData.short_address}
                </Text>}
              </View>
              <View style={styles.distanceContainer}>
                  <Text
                    style={[
                      styles.distanceData,
                      { fontWeight: "900", fontSize:10, lineHeight: 12 },
                    ]}
                  >
                    {Math.round(item?.distance)}
                  </Text>
                  <Text
                    style={[
                      styles.distanceData,
                      { fontSize: 7, fontWeight: "bold", lineHeight: 8 },
                    ]}
                  >
                    KMS
                  </Text>
              </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(NearByPost);

const styles = StyleSheet.create({
  image: {
    // width: (width - 21) / 2,
    // height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
    zIndex: 20,
    backgroundColor: COLORS.foitiGreyLighter
  },
  imageDefault: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    backgroundColor: COLORS.foitiGreyLighter
  },
  imageHome: {
    width: (width - 70) / 2,
    height: (width - 70) / 2,
  },
  locationName: {
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems:"center",
    backgroundColor: COLORS.foitiGreyLighter,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // height: 40,
    // width: (width - 21) / 2,
  },
  defaultLocation: {
    height: 40,
    width: (width - 21) / 2,
  },
  homeLocation: {
    // backgroundColor: "#fff",
    height: 40,
    width: (width - 70) / 2,
    paddingHorizontal: 10
  },
  backDrop:{
    zIndex: 1,
    height:20,
    width:"100%",
    backgroundColor:COLORS.foitiGreyLighter,
    position:"absolute",
    bottom:-1,
    left:0
  },
  distanceContainer: {
    justifyContent:"center",
    alignItems:"center"
  },
  distanceData: {
    color: "#303030",
    textAlign: "center",
  },
});
