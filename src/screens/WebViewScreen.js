import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";

const WebViewScreen = ({ route }) => {
  const { link, title } = route.params;
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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title={title} />
      </View>
      <WebView source={{ uri: link }} />
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({});
