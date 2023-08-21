import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";

const Settings = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.AUTHUSER);

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
    return true;
  });
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title="Settings" isProfile={false} />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.settingBox}>
          <Text style={styles.header}>Account</Text>
        </View>
        <TouchableOpacity
          style={styles.settingBox}
          onPress={() => navigation.navigate("Change Email")}
        >
          <Text>Email</Text>
          <Text style={{ color: COLORS.foitiGrey }}>{user.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBox}
          onPress={() => navigation.navigate("Change Username")}
        >
          <Text>Username</Text>
          <Text style={{ color: COLORS.foitiGrey }}>{user.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBox}
          onPress={() => navigation.navigate("Change Phone")}
        >
          <Text>Phone Number</Text>
          <Text style={{ color: COLORS.foitiGrey }}>{user.phoneNumber}</Text>
        </TouchableOpacity>
        <View style={styles.settingBox}>
          <Text style={styles.header}>Security</Text>
        </View>
        <TouchableOpacity
          style={styles.settingBox}
          onPress={() => navigation.push("Blocked Users")}
        >
          <Text>Blocked Users</Text>
        </TouchableOpacity>
        {user.tokenVersion === 0 && user.socialLogin ? (
          <View />
        )
        :(
        <TouchableOpacity
          style={styles.settingBox}
          onPress={() => navigation.navigate("Change Password")}
        >
          <Text>Change Password</Text>
        </TouchableOpacity>)}
        <View>
          <TouchableOpacity
            style={{ marginTop: 50 }}
            onPress={() => navigation.navigate("DeactivateScreen")}
          >
            <Text style={styles.header}>Deactivate Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  settingBox: {
    marginBottom: 25,
  },
  header: {
    fontWeight: "bold",
  },
});
