import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Image,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { COLORS, FOITI_CONTS } from "../../resources/theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("screen");

const ExploreContainer = ({ explorePosts, place }) => {
  const navigation = useNavigation();
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

  //OPEN PERTICAULAR EXPLORE POST

  const openPost = (item) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post: item._id });
  };

  //VIEW ALL POSTS
  const handleExplorePlace = () => {
    navigation.push(`ExplorePlace via ${REDUXNAVIGATION.name}`, { place_id: place._id });
  };
  return (
    <View style={{ marginVertical: 10 }}>
      <View style={{ paddingHorizontal: FOITI_CONTS.padding + 7 }}>
        <Text style={{ marginVertical: 10, fontWeight: "bold" }}>
          Explore {place?.name}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        {explorePosts.map((item) => {
          const formatedAddress =
            item?.place.local_address || item?.place.short_address;
          return (
            <View
              key={item._id}
              style={{
                marginBottom: 7,
              }}
            >
              <TouchableWithoutFeedback onPress={() => openPost(item)}>
                <View>
                  <View style={{ position:"relative" }}>
                    <Image
                      source={{
                        uri: `${process.env.BACKEND_URL}/image/${item?.content[0]?.image?.thumbnail?.private_id}`,
                      }}
                      style={styles.image}
                    />
                    <View style={styles.backDrop} />
                  </View>
                  <View />
                  <View style={styles.locationName}>
                    <View>
                      <View style={{ marginLeft: 4, maxWidth: 150 }}>
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 12 }}
                        >
                          {item?.place?.name}
                        </Text>
                        {formatedAddress != undefined && formatedAddress != "" && (
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 10,
                            }}
                          >
                            {formatedAddress}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
      {explorePosts.length == 10 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleExplorePlace}>
            <Text style={{ color: "#fff" }}>Explore More</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ExploreContainer;

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 7,
    flexWrap: "wrap",
  },
  image: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
    zIndex:10
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: COLORS.foitiGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40 ,
    paddingVertical: 12,
    borderRadius: 20,
  },
  locationName: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: "100%",
    backgroundColor: COLORS.foitiGreyLighter,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    height: 40,
    zIndex: 10
  },
  backDrop:{
    width: "100%",
    backgroundColor:COLORS.foitiGreyLighter,
    height: 20,
    position:"absolute",
    bottom:0,
    left:0,
    zIndex:1,
  }
});
