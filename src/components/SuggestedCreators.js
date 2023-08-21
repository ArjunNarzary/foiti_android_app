import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const SuggestedCreators = ({ users }) => {
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [userData, setUserData] = useState([]);
  const navigation = useNavigation();

  useState(() => {
    setUserData(users);
  }, [users]);
  const _renderItem = ({ item }) => {
    let profilePhtot =
      item?.userId?.profileImage?.large?.private_id || "profile_picture.jpg";

    const openProfile = () => {
      navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, {
        userId: item?.userId?._id,
      });
    };

    return (
      <TouchableOpacity
        style={{ marginHorizontal: 15, marginVertical: 20 }}
        onPress={openProfile}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: `${process.env.BACKEND_URL}/image/${profilePhtot}` }}
            style={styles.avatar}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 5,
            }}
          >
            <Text style={styles.name}>{item?.userId?.name}</Text>
            {item.userId?.foiti_ambassador && (
              <MaterialCommunityIcons
                name="shield-check"
                style={{ color: COLORS.foiti, fontSize: 15 }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        borderBottomColor: "#ededed",
        borderBottomWidth: 10,
      }}
    >
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          paddingLeft: FOITI_CONTS.padding + 5,
          borderBottomWidth: 0.5,
          borderBottomColor: COLORS.foitiGreyLight,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#000",
          }}
        >
          Recommended Travellers
        </Text>
      </View>
      <FlatList
        data={userData}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={(item) => {
          return item._id;
        }}
      />
    </View>
  );
};

export default SuggestedCreators;

const styles = StyleSheet.create({
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  name: {
    fontWeight: "bold",
  },
});
