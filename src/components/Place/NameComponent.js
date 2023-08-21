import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../resources/theme";

const NameComponent = ({ name, type = null, sharePlace, openNavigation }) => {
  return (
    <View>
      <View style={styles.conatainer}>
        <Text style={styles.header}>{name}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={{ marginLeft: 20 }} onPress={openNavigation}>
            <FontAwesome5 name="directions" style={[styles.icons]} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 20 }} onPress={sharePlace}>
            <Ionicons name="share-social-outline" style={[styles.icons]} />
          </TouchableOpacity>
        </View>
      </View>
      {/* {type != null && <Text style={styles.type}>{type}</Text>} */}
    </View>
  );
};

export default NameComponent;

const styles = StyleSheet.create({
  conatainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingVertical: 4,
    marginTop: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 0,
    maxWidth: "70%",
  },
  icons: {
    fontSize: 20,
    color: COLORS.foitiGrey,
  },
  type: {
    lineHeight: 13.5,
    fontWeight: "bold",
    fontSize: 13,
    color: COLORS.foitiGrey,
  },
  iconContainer: {
    flexDirection: "row",
  },
});
