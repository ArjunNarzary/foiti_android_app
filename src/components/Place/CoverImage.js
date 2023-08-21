import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
const { width } = Dimensions.get("window");

const CoverImage = ({ place }) => {
  return (
    <View style={{ width: "100%", height: 220 }}>
      <Image
        style={{ width, height: 220, resizeMode: "cover" }}
        source={{
          uri: `${process.env.BACKEND_URL}/image/${place?.cover_photo?.large?.private_id}`,
        }}
      />
    </View>
  );
};

export default CoverImage;

const styles = StyleSheet.create({});
