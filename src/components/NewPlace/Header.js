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
import { COLORS } from "../../resources/theme";

const { width, _ } = Dimensions.get("screen");

const Header = ({
  activeStatus,
  backPressed,
  onPost,
  onEditPost,
  title = "New Post",
  backStatus = true,
  isEdit = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {backStatus && (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={backPressed}
          >
            <Ionicons name="md-chevron-back-sharp" style={{ fontSize: 25 }} />
          </Pressable>
        )}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
            color: COLORS.foitiGrey,
          }}
        >
          {isEdit? "Edit" : title}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={isEdit ? onEditPost : onPost}
          // disabled={!activeStatus}
          style={[
            styles.buttonBox,
            activeStatus ? styles.activeBackground : styles.inactiveBackground,
          ]}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "#fff" }}>
            {isEdit ? "Save" : "Post"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 10,
  },
  icon: {
    fontSize: 28,
    color: COLORS.foitiGrey,
  },
  activeBackground: {
    backgroundColor: COLORS.foiti,
  },
  inactiveBackground: {
    backgroundColor: COLORS.foitiGreyLight,
  },
  buttonBox: {
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 2,
    borderRadius: 17
  },
});
