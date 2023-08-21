import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const NavButton = ({ icon, title, onTab, isFA=false }) => {
  return (
    <View style={{ paddingVertical: 12 }}>
      <TouchableOpacity style={styles.iconContainer} onPress={onTab}>
        {icon}
        <Text style={styles.contents}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavButton;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contents: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
