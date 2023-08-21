import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import BoxInput from "../../components/BoxInput";
import { images, STYLES, COLORS } from "resources";
import PostPlaceHeader from "../../components/Header/PostPlaceHeader";
import { validateForm } from "../../Redux/customApis/validator";
import { useSendResetPasswordEmailMutation } from "../../Redux/services/serviceApi";

const { width, height } = Dimensions.get("window");
const Email = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState({});

  const [
    sendResetPasswordEmail,
    { data, error, isLoading, isSuccess, isError },
  ] = useSendResetPasswordEmailMutation();

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate("Otp", { id: data.id });
    }
    if (isError) {
      setErrorMsg(error?.data?.message);
    }
  }, [isSuccess, isError]);

  const submit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ email });
    if (checkForm.valid) {
      await sendResetPasswordEmail({ email });
    } else {
      setErrorMsg(checkForm.errors);
    }
  };
  return (
    <View style={{ height, width, backgroundColor: "#fff" }}>
      <PostPlaceHeader title="Reset Password" />
      <View style={{ paddingHorizontal: 40 }}>
        <View style={{ paddingTop: 80, paddingBottom: 50 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              color: COLORS.foitiGrey,
            }}
          >
            Yo! Forgot Your Password?
          </Text>
        </View>

        <View style={{ paddingVertical: 20 }}>
          <Text style={{ textAlign: "center" }}>
            No worries! Enter your email and we will send you an OTP to reset
            your password.
          </Text>
        </View>
        <View>
          <BoxInput
            value={email}
            label="Email"
            keyboardType="email-address"
            setValue={(value) => {
              setErrorMsg({ email: "" });
              setEmail(value);
            }}
            isPassword={false}
            error={errorMsg?.email || errorMsg?.general}
          />
        </View>

        {/* SIGN IN BUTTON START */}
        <View style={{ paddingVertical: 20 }}>
          <TouchableOpacity
            onPress={submit}
            disabled={isLoading ? true : false}
            style={[STYLES.button, { backgroundColor: COLORS.foiti }]}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={[STYLES.buttonText, { borderRadius: 30 }]}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Email;

const styles = StyleSheet.create({});
