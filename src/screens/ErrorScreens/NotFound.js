import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../resources";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useBackHandler } from "@react-native-community/hooks";
const { width, height } = Dimensions.get("window");

const NotFound = ({ route }) => {
  const navigation = useNavigation();
  const text =
    route?.params?.text || "Looks like you've followed a broken link.";
  useBackHandler(() => {
    goBack();
    return true;
  });

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "WelcomeStack",
        },
      ],
    });
  };
  return (
    <View>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={goBack}
          >
            <Ionicons name="md-chevron-back-sharp" style={{ fontSize:25 }} />
          </Pressable>
          <View
            style={{
              width: Dimensions.get("window").width - 100,
              justifyContent: "center",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                marginLeft: 10,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Error
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <FontAwesome5
          name="sad-tear"
          size={150}
          color={COLORS.foitiGreyLight}
          style={{ marginBottom: 10 }}
        />
        <Text style={{ color: COLORS.foitiGrey, fontWeight: "bold" }}>
          {/* {message} */}
          {/* Looks like you've followed a broken link. */}
          {text}
        </Text>
        <TouchableOpacity style={styles.goHome} onPress={goBack}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.2,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  body: {
    height: height - 55,
    paddingTop: 150,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30
  },
  goHome: {
    backgroundColor: COLORS.foiti,
    position: "absolute",
    bottom: 100,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
