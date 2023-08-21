import { StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { COLORS } from "../resources/theme";
import { Feather, Ionicons } from "@expo/vector-icons"

const BoxInput = ({
  value,
  label,
  setValue,
  isPassword,
  hideShow,
  error = "",
  keyboardType = "default",
}) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <FloatingLabelInput
        label={label}
        value={value}
        onChangeText={setValue}
        isPassword={isPassword}
        customShowPasswordComponent={hideShow && <Ionicons name="ios-eye-off-outline" size={20} color={COLORS.foitiGreyLight} style={{ marginRight: 2 }} />}
        customHidePasswordComponent={hideShow && <Ionicons name="eye-outline" size={20} color={COLORS.foitiGrey} style={{ marginRight: 2 }} />}
        keyboardType={keyboardType}
        containerStyles={{
          borderWidth: 1,
          paddingHorizontal: 15,
          paddingVertical: 8,
          backgroundColor: "#fff",
          borderColor: error ? "red" : COLORS.foitiGreyLight,
          borderRadius: 30,
        }}
        customLabelStyles={{
          colorFocused: COLORS.foiti,
          colorBlurred:COLORS.foitiGrey,
          fontSizeFocused: 10,
          topFocused: -15,
        }}
        labelStyles={{
          backgroundColor: "#fff",
          paddingHorizontal: 2,
        }}
        inputStyles={{
          color: COLORS.foitiBlack,
          paddingHorizontal: 5,
        }}
      />
      <Text style={{ color: "red", fontSize: 11, paddingLeft:24 }}>{error}</Text>
    </View>
  );
};

export default BoxInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
