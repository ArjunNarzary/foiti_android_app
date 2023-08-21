import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const SocialInput = ({ text, value, onChange }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginTop: 15,
        }}
      >
        <Text>{text}/</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{
              borderBottomWidth: 0.8,
              padding: 1,
              marginBottom: 0,
              paddingBottom: 0,
              flex: 1,
            }}
            value={value}
            onChangeText={onChange}
          />
        </View>
      </View>
    </View>
  );
};

export default SocialInput;
