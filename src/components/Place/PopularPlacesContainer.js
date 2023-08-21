import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { COLORS } from "../../resources/theme";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const PopularPlacesContainer = ({ place, popularPlaces }) => {
  const navigation = useNavigation();
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

  //HANDLE PUPLAR PLACE PRESS
  const handlePopularPlacePress = (item) => {
    if (
      (item.types.length > 1 &&
        (item.types[1] == "Country" ||
          item.types[1] == "State" ||
          item.types[1] == "Union Territory")) ||
      item.destination
    ) {
      navigation.push(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: item._id });
    } else {
      navigation.push(`Place via ${REDUXNAVIGATION.name}`, { place_id: item._id });
    }
  };

  const openPopularPlaces = () => {
    navigation.push(`PopularPlaces via ${REDUXNAVIGATION.name}`, { place });
  };

  return (
    <View style={{ marginVertical: 10, paddingHorizontal: 7 }}>
      {place.types[1] != "country" && (
        <Text style={{ margin: 10, fontWeight: "bold" }}>
          Popular Attractions in {place?.name}
        </Text>
      )}
      <View style={styles.imageContainer}>
        {popularPlaces.map((item) => {
          return (
            <View
              key={item._id}
              style={{
                marginBottom: 7
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => handlePopularPlacePress(item)}
              >
                <View>
                  <View>
                    <Image
                      source={{
                        uri: `${process.env.BACKEND_URL}/image/${item?.cover_photo?.thumbnail?.private_id}`,
                      }}
                      style={styles.image}
                    />
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: place.types[1] == "country" ? 3 : 4,
                      maxWidth: width / 2 - 24,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        maxWidth: width / 2 - 24,
                        fontSize: 13,
                      }}
                    >
                      {item.name}
                    </Text>
                    {place.types[1] != "country" && (
                      <Text numberOfLines={1} style={{ fontSize: 11, lineHeight: 15 }}>
                        {item.types[1]}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
      {place.types[1] != "country" && popularPlaces.length == 6 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openPopularPlaces}>
            <Text style={{ color: "#fff", fontWeight:"bold" }}>View All Attractions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PopularPlacesContainer;

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  image: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  button: {
    backgroundColor: COLORS.foitiGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
});
