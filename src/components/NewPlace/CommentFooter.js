import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../resources/theme";

const CommentFooter = () => {
  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="chatbox-outline" style={styles.icons} />
          <Text style={styles.text}>Comments Enable</Text>
        </View>
        <View>
          <Switch
            trackColor={{
              false: COLORS.foitiGreyLight,
              true: COLORS.foitiGrey,
            }}
            ios_backgroundColor="#3e3e3e"
            thumbColor="#fff"
            value={checked}
            onValueChange={(value) => setChecked(value)}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="information-circle-outline" style={styles.icons} />
        <Text style={styles.text}>Instructions</Text>
      </View>
    </View>
  );
};

export default CommentFooter;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: COLORS.foitiGrey,
    borderBottomWidth: 0.5,
  },
  icons: {
    fontSize: 18,
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.foitiGrey,
    fontWeight: "bold",
  },
});
