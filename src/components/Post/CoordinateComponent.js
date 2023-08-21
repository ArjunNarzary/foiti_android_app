import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { convertDecimalToDMS } from "../../utils/handle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, FOITI_CONTS } from "../../resources/theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Pressable } from "react-native";
import { Dimensions } from "react-native";
import { addNavigation } from "../../Redux/slices/addNavigationSlice";
import { addRouteParams } from "../../Redux/slices/routeParamSlice";
import { useDirectionClickedOnPostMutation } from "../../Redux/services/serviceApi";
const { width, height } = Dimensions.get("screen");

const CoordinateComponent = ({ post }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [directionClickedOnPost, { data }] = useDirectionClickedOnPostMutation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  //GET DMS COORDINATES
  const { lat, lng } = convertDecimalToDMS(
    post?.content[0]?.coordinate?.lat,
    post?.content[0]?.coordinate?.lng
  );

  const openMap = () => {
    if (
      post?.content[0]?.location?.coordinates &&
      post?.content[0]?.location?.coordinates.length > 1
    ) {
      directionClickedOnPost({
        postId: post?._id,
        token: REDUXUSER.token,
      });
      const coordinates = {
        latitude: post?.content[0]?.location?.coordinates[1],
        longitude: post?.content[0]?.location?.coordinates[0],
        name: post?.place?.name,
      };

      dispatch(
        addRouteParams({
          coords: coordinates,
          post: post,
        })
      )
      dispatch(
        addNavigation({
          name: "map",
        })
      )
      if(REDUXNAVIGATION.name == "map"){
        navigation.navigate("Map Stack")
      }else{
        navigation.navigate('Map')
      }

    }
    return;
  };

  return (
    <View style={styles.container}>
      <View style={styles.coordinateContainer}>
        <View style={styles.coordinate}>
          <Text style={{ fontWeight: "bold", fontSize: 13, color: "#303030" }}>
            {lat},{"  "} {lng}
          </Text>
        </View>
      </View>
      <View style={styles.mapButtonContainer}>
        <Pressable style={styles.mapButton} onPress={openMap}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={18}
            color="#fff"
          />
          <Text style={{ fontSize: 14, marginLeft: 4, color: "#fff" }}>Map</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CoordinateComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  coordinateContainer: {
    paddingTop:15,
    marginTop:-15,
    flexGrow: 1,
    backgroundColor: COLORS.foitiGreyLighter,
    borderBottomLeftRadius: 12,
    zIndex: -1,
  },
  coordinate: {
    justifyContent: "center",
    paddingLeft: FOITI_CONTS.padding,
    backgroundColor: COLORS.foitiGreyLighter,
    position:"relative",
    borderBottomLeftRadius: 12,
    height: 40,
  },
  mapButtonContainer: {
    paddingTop: 15,
    marginTop:-15,
    width: 90,
    backgroundColor: COLORS.foitiGrey,
    borderBottomRightRadius: 12,
    zIndex: -1,
  },
  mapButton: {
    paddingHorizontal:22,
    backgroundColor: COLORS.foitiGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderBottomRightRadius: 12,
  },
});
