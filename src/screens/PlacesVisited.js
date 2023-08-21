import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { usePlacesVisitedQuery } from "../Redux/services/serviceApi";
import { useSelector } from "react-redux";
import { COLORS } from "../resources/theme";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import ServerError from "../components/Error/ServerError";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
const { width, height } = Dimensions.get("screen");

const PlacesVisited = ({ route }) => {
  const user = route.params.user;
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const { data, isLoading, isError, isSuccess, refetch } =
    usePlacesVisitedQuery({
      token: REDUXUSER.token,
      ip: REDUXIP.ip,
      user_id: user?._id,
    });
  const [places, setPlaces] = useState({});
  const [isMounted, setIsMounted] = useState(true);
  const navigation = useNavigation();

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

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (isSuccess) {
        setPlaces(data.posts);
      }
    }
  }, [isSuccess, isError]);

  const reload = () => {
    refetch();
  };

  //HENDLE SEARCH REASULTS PRESSED
  const suggestionPress = (index) => {
    const result = places[index];
    const placeId = result?.place?.original_place_id || result?.place?._id;
    // navigation.navigate("Place via search", { place_id: result._id });
    if (
      result?.place?.types[1] == "Country" ||
      result?.place?.types[1] == "State" ||
      result?.place?.types[1] == "Union Territory" ||
      result?.place?.destination
    ) {
      navigation.push(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: placeId });
    } else {
      navigation.push(`Place via ${REDUXNAVIGATION.name}`, {
        place_id: placeId,
      });
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <PostPlaceHeader title="Places Visited" />
      {isSuccess ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 20 }}>
            <Text>
              Here you will see the countries and places{" "}
              <Text style={{ fontWeight: "bold" }}>
                {user._id.toString() != REDUXUSER?.user?._id.toString()
                  ? user.name
                  : "you"}
              </Text>{" "}
              visited.
            </Text>
            {places.length > 0 ? (
              <View style={styles.mainContainer}>
                {places.map((item, index) => {
                  const formatedAddress =
                    item?.place?.short_address || item?.place?.local_address;
                  return (
                    <TouchableOpacity
                      style={styles.placeTouchable}
                      key={index}
                      // disabled={true}
                      onPress={() => suggestionPress(index)}
                    >
                      {item?.content[0]?.image != undefined &&
                      item?.content[0]?.image.small?.private_id != "" ? (
                        <Image
                          source={{
                            uri: `${process.env.BACKEND_URL}/image/${item?.content[0]?.image.small.private_id}`,
                          }}
                          style={styles.thumbnail}
                        />
                      ) : (
                        <View style={[styles.thumbnail, styles.thumbnailBox]}>
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 20,
                              fontWeight: "bold",
                            }}
                          >
                            {item?.place?.name}
                          </Text>
                        </View>
                      )}
                      <View style={{ width: width - 90 }}>
                        <Text style={{ fontWeight: "bold" }} numberOfLines={1}>
                          {item?.place?.name}
                        </Text>
                        {formatedAddress != undefined && formatedAddress != "" && (
                          <Text
                            numberOfLines={1}
                            style={{ fontSize: 12, lineHeight: 15 }}
                          >
                            {formatedAddress}
                          </Text>
                        )}
                        {item?.place?.types[1] && (
                          <Text
                            numberOfLines={1}
                            style={{ fontSize: 12, lineHeight: 15 }}
                          >
                            {item?.place?.types[1]}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View>
                <Text>No posts</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <ServerError onPress={reload} />
      )}
    </View>
  );
};

export default PlacesVisited;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
  },
  InputContainer: {
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.2,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  input: {
    backgroundColor: "#878787",
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
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
});
