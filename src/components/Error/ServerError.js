import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
const { width, height } = Dimensions.get("screen");
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../resources/theme";

const ServerError = ({
  onPress,
  text = "Please try reloading.",
  custom = false,
  buttonText,
}) => {
  return (
    <View
      style={{
        width,
        height: height - 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Opps! Something went wrong.</Text>
      <Text>{text}</Text>
      {/* {!custom ?? (
        
      )} */}
      {custom ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            marginBottom: 5,
            marginTop: 10,
            backgroundColor: COLORS.foiti,
            width: 100,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={{ marginBottom: 5, marginTop: 10 }}
        >
          <Ionicons
            name="reload-circle-sharp"
            style={{ fontSize: 30, color: COLORS.foitiGrey }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ServerError;
