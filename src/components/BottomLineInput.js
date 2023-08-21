import { StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { COLORS } from "../resources/theme";

const BottomLineInput = ({ value, label, setValue, error }) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <FloatingLabelInput
        label={label}
        value={value}
        onChangeText={setValue}
        containerStyles={{
          borderBottomWidth: 1,
          paddingHorizontal: 0,
          paddingVertical: 8,
          backgroundColor: "#fff",
          borderColor: COLORS.foitiGrey,
          marginBottom: 2,
        }}
        customLabelStyles={{
          colorFocused: COLORS.foiti,
          fontSizeFocused: 13,
          topFocused: -20,
        }}
        labelStyles={{
          backgroundColor: "#fff",
          paddingHorizontal: 0,
        }}
        inputStyles={{
          color: COLORS.foitiGrey,
          paddingHorizontal: 5,
        }}
      />
      <Text style={{ color: "red", fontSize: 11 }}>{error}</Text>
    </View>
  );
};

export default BottomLineInput;
