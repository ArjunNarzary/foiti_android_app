import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";

const Help = () => {
  const navigation = useNavigation();

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

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <PostPlaceHeader title="Help" isProfile={false} />
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          How to capture geo-tagged photos with your phone?
        </Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.main}>
          <Text>Step 1</Text>
          <Text>
            Turn on <Text style={{ fontWeight: "bold" }}>"Location Tags"</Text>{" "}
            or <Text style={{ fontWeight: "bold" }}>"Save Location"</Text> in
            your camera app.
          </Text>
        </View>
        <View style={styles.main}>
          <Text>Step 2</Text>
          <Text>Make sure your GPS is "ON" while taking the photo.</Text>
        </View>
        <View style={styles.main}>
          <Text>Step 3</Text>
          <Text>
            Upload the photo without editing. However, you may use the “crop”
            and “filter” feature in Foiti App.
          </Text>
        </View>
        <View style={styles.main}>
          <Text style={{ fontWeight: "bold" }}>
            Note: Don't upload compressed photo received via Messaging Apps.
          </Text>
        </View>
      </View>
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleBack}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Help;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.foitiGreyLighter,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  main: {
    marginTop: 20,
  },
  submitContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 50,
  },
  submitButton: {
    backgroundColor: COLORS.foiti,
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 21,
  },
});
