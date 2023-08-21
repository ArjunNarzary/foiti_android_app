import React, { memo, useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { BACKEND_URL } from "@env";
import { COLORS } from "../../resources/theme";
const { width, height } = Dimensions.get("screen");

const NearByPlace = ({ item, onPressPlace }) => {
  const [type, setType] = useState("");
  useEffect(() => {
    let splitType = "";
    if (item?.types.length > 0) {
      splitType = item?.types[1].split("_");
    } else {
      splitType = item?.google_types[0].split("_");
    }

    const formatedType = splitType
      .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
      .join(" ");

    setType(formatedType);
  }, [item]);

  return (
    // <View>
      <TouchableWithoutFeedback onPress={() => onPressPlace(item)}>
        <View>
          <View>
            <Image
              source={{
                uri: `${BACKEND_URL}/image/${item?.cover_photo?.thumbnail?.private_id}`,
              }}
              style={styles.image}
            />
          </View> 

          <View style={styles.locationName}>
            <View style={styles.nameContainer}>
              <Text
                style={{ fontSize: 11, fontWeight: "bold" }}
                numberOfLines={1}
              >
                {item?.name}
              </Text>
              <Text style={{ fontSize: 11 }} numberOfLines={1}>
                {type}
              </Text>
            </View>
            <View styles={styles.distanceContainer}>
              <Text style={[styles.distanceData, { fontWeight: "900", fontSize: 10 }]}>
                {Math.round(item?.distance)}
              </Text>
              <Text
                style={[
                  styles.distanceData,
                  { fontSize: 6, fontWeight: "bold", marginBottom: 1 },
                ]}
              >
                KMS
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
};

export default memo(NearByPlace);

const styles = StyleSheet.create({
  locationName: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
  },
  nameContainer: {
    maxWidth: (width - 80) / 2,
  },
  distanceData: {
    color: COLORS.foitiGrey,
    textAlign: "center",
  },
  distanceContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
