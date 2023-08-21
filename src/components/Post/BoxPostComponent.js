import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { memo } from "react";
const windowWidth = Dimensions.get("window").width;
import { BACKEND_URL } from "@env";
import { COLORS } from "../../resources/theme";

const BoxPostComponent = ({ item, onPress }) => {
  const formatedAddress =
    item?.place?.local_address || item?.place?.short_address;
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => onPress(item._id)}>
        <View>
          <Image
            source={{
              uri: `${BACKEND_URL}/image/${item?.content[0]?.image?.thumbnail?.private_id}`,
            }}
            style={styles.image}
          />
          <View style={styles.locationName}>
            <View style={{
              paddingHorizontal: 5,
              paddingVertical: 5, 
              zIndex:20
              }}>
                <View
                  style={{
                    marginLeft: 4,
                    maxWidth: 150
                  }}
                >
                <Text numberOfLines={1} style={{ fontSize: 12, maxWidth: 150 }}>
                    {item?.place?.name}
                  </Text>
                  {formatedAddress != undefined && formatedAddress != "" && (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10,
                        maxWidth: 150
                      }}
                    >
                      {formatedAddress}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.backDrop}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(BoxPostComponent);

const styles = StyleSheet.create({
  locationName: {
    width: "100%",
    backgroundColor: COLORS.foitiGreyLighter,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    position:"relative",
    height:40,
    justifyContent:"center"
  },
  image: {
    width: (windowWidth - 21) / 2,
    height: (windowWidth - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
    zIndex:20,
    backgroundColor: COLORS.foitiGreyLighter
  },
  backDrop:{
    width: "100%",
    height:10,
    backgroundColor:COLORS.foitiGreyLighter,
    position:"absolute",
    top:-10,
    zIndex:1
  }
});
