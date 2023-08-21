import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet
} from "react-native";
import React, { useEffect, useState } from "react";

import BoxInput from "../components/BoxInput";
import { images, STYLES, COLORS } from "resources";
import { useNavigation } from "@react-navigation/native";
import { useRegisterUserMutation } from "../Redux/services/serviceApi";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/slices/authSlice";
import { setItemInStore } from "../utils/handle";
import { validateForm } from "../Redux/customApis/validator";
const { width, height } = Dimensions.get("window");

const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const dispatch = useDispatch();
  const [registerUser, { data, error, isLoading, isError, isSuccess }] =
    useRegisterUserMutation();

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        const resData = {
          user: data?.user,
          token: data?.token,
        };
        dispatch(addUser(resData));
        await setItemInStore("userData", resData);
        navigation.navigate("WelcomeStack");
      }
      if (isError) {
        setErrorMsg(error?.data?.message);
      }
    })();
  }, [isSuccess, isError]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ email, password, confirmPassword });
    if (checkForm.valid) {
      const data = { email, password, confirmPassword };
      await registerUser(data);
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  const openCustomBrowser = async (link, title) => {
    navigation.navigate("WebViewScreen", { link, title });
  };

  return (
    <View style={{ height, backgroundColor: "#fff", paddingHorizontal: 40 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 220,
        }}
      >
        <Image source={images.logo} style={STYLES.logo} />
      </View>
      <View>
        <BoxInput
          value={email}
          label="Email"
          setValue={(value) => {
            setErrorMsg({ email: "" });
            setEmail(value);
          }}
          isPassword={false}
          error={errorMsg?.email ? errorMsg.email : ""}
        />
        <BoxInput
          value={password}
          label="Password"
          setValue={(value) => {
            setErrorMsg({ password: "" });
            setPassword(value);
          }}
          isPassword={true}
          hideShow={true}
          error={errorMsg?.password ? errorMsg.password : ""}
        />

        <BoxInput
          value={confirmPassword}
          label="Confirm Password"
          setValue={(value) => {
            setErrorMsg({ confirmPassword: "" });
            setConfirmPassword(value);
          }}
          isPassword={true}
          hideShow={false}
          error={errorMsg?.confirmPassword ? errorMsg.confirmPassword : ""}
        />
      </View>

      {/* SIGN UP BUTTON START */}
      <View style={{ paddingVertical: 16 }}>
        <TouchableOpacity
          style={[STYLES.button, { backgroundColor: COLORS.foiti, borderRadius: 40 }]}
          onPress={handleRegister}
          disabled={isLoading ? true : false}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={STYLES.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* SIGN UP BUTTON END */}

      {/* SIGN IN BUTTON START */}
      <View style={{ flexDirection: "row" }}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: COLORS.foitiLink, marginLeft: 3 }}>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
      {/* SIGN IN BUTTON START */}
      <View style={styles.agreementContainer}>
        <Text>By signing up, you agree to Foiti's</Text>
        <TouchableOpacity
          onPress={() => openCustomBrowser("https://foiti.com/tou", "Terms of Service")}
        >
          <Text style={{ color: COLORS.foitiLink }}>Terms of Service</Text>
        </TouchableOpacity>
        <Text> and acknowledge Foiti's</Text>
        <TouchableOpacity
          onPress={() => openCustomBrowser("https://foiti.com/privacy", "Privacy Policy")}
        >
          <Text style={{ color: COLORS.foitiLink }}>Privacy Policy.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  agreementContainer: {
    flexDirection: "row", 
    justifyContent: "center", 
    width : "100%", 
    flexWrap: "wrap",
    marginTop: 45
  }
})