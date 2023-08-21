import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import AppLoading from "expo-app-loading";

import { STYLES } from "resources";

import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";

const CustomText = ({ children, textType, style, numberOfLines }) => {
  let [fontsLoaded] = useFonts({
    RobotoLight: Roboto_300Light,
    RobotoRegular: Roboto_400Regular,
    RobotoBold: Roboto_700Bold,
    RobotoBlack: Roboto_900Black,
    RobotoBlackItalic: Roboto_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  let textStyle = {};
  switch (textType) {
    case "light":
      textStyle = styles.light;
      break;
    case "regular":
      textStyle = styles.regular;
      break;
    case "bold":
      textStyle = styles.bold;
      break;
    case "black":
      textStyle = styles.black;
      break;
    default:
      textStyle = styles.regular;
      break;
  }

  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[textStyle, { ...passedStyles }]}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  light: {
    fontFamily: "RobotoLight",
  },
  regular: {
    fontFamily: "RobotoRegular",
  },
  bold: {
    fontFamily: "RobotoBold",
    // fontFamily: "RobotoBlackItalic",
  },
  black: {
    fontFamily: "RobotoBlack",
  },
});
