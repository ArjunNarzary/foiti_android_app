import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../resources/theme";
const { width, height } = Dimensions.get("window");

const CustomAlert = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={{ fontWeight: "bold", color: "#fff" }}>{text}</Text>
      </View>
    </View>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "none",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width,
    bottom: 20,
  },
  box: {
    backgroundColor: COLORS.foitiGrey,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 15,
    minWidth: width - 150,
    alignItems: "center",
    justifyContent: "center",
  },
});
