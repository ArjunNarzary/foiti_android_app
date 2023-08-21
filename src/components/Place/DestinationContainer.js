import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { COLORS, FOITI_CONTS } from "../../resources/theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const DestinationContainer = ({ destinations, name }) => {
  const navigation = useNavigation();
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

  //HANDLE DESTINATION ITEM PRESSED
  const handleDestinationPressed = (item) => {
    navigation.push(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: item._id });
  };

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginLeft: 7,
          width: 90,
          alignItems: "center",
          //   alignItems: "center",
        }}
        onPress={() => handleDestinationPressed(item)}
      >
        <Image
          style={{
            width: 70,
            height: 70,
            resizeMode: "cover",
            borderRadius: 35,
          }}
          source={{
            uri: `${process.env.BACKEND_URL}/image/${item?.cover_photo?.thumbnail?.private_id}`,
          }}
        />
        <Text
          numberOfLines={1}
          style={{
            textAlign: "center",
            marginTop: 5,
            fontSize: 13,
            width: "100%",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: FOITI_CONTS.padding + 7 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Destinations in {name}
        </Text>
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={destinations}
        renderItem={(item) => _renderItem(item)}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default DestinationContainer;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: COLORS.foitiGreyLighter,
    paddingVertical: 10,
    // paddingHorizontal: 20,
  },
});
