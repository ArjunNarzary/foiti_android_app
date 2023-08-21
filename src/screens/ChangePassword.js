import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useUpdatePasswordMutation } from "../Redux/services/serviceApi";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";

const { width, height } = Dimensions.get("screen");

const ChangePassword = () => {
  const navigation = useNavigation();
  //STATES
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [secure, setSecure] = useState(true);
  //REDEX DATA
  const REDUXUSER = useSelector((state) => state.AUTHUSER);

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

  //SERVER API CALLS
  const [updatePassword, { data, error, isLoading, isSuccess, isError }] =
    useUpdatePasswordMutation();

  //VALIDATE FORM
  //FORM VALIDATION
  const isValidForm = () => {
    if (!currentPassword.trim()) {
      setErrorMsg({ currentPassword: "Please enter current password" });
      return false;
    }
    if (!newPassword.trim()) {
      setErrorMsg({ newPassword: "Please enter new password" });
      return false;
    }
    if (newPassword.trim().length < 8) {
      setErrorMsg({
        newPassword: "Password must contain atleast 8 characters",
      });
      return false;
    }
    if (currentPassword.trim() == newPassword.trim()) {
      setErrorMsg({
        newPassword: "New password can't be same as current password",
      });
      return false;
    }
    if (!confirmPassword.trim()) {
      setErrorMsg({ confirmPassword: "Please enter confirm password" });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg({
        confirmPassword: "Password does not match",
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isSuccess) {
      setErrorMsg({});
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Settings");
      }
    }
    if (isError) {
      setErrorMsg(error.data.message);
    }
  }, [isSuccess, isError]);

  //HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const body = {
        newPassword,
        currentPassword,
        confirmPassword,
        token: REDUXUSER.token,
      };
      await updatePassword(body);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal:7 }}>
        <PostPlaceHeader title="Change Password" isProfile={false} />
      </View>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            Current Password
          </Text>
          <TextInput
            style={[
              styles.input,
              errorMsg.currentPassword
                ? styles.errorBorderColor
                : styles.normalBorderColor,
            ]}
            value={currentPassword}
            onChangeText={(text) => {
              setErrorMsg({ currentPassword: "" });
              setCurrentPassword(text);
            }}
            secureTextEntry={true}
          />
          <Text style={{ color: "red", fontSize: 11 }}>
            {errorMsg.currentPassword && errorMsg.currentPassword}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            New Password
          </Text>
          <View>
            <TextInput
              style={[
                styles.input,
                errorMsg.currentPassword
                  ? styles.errorBorderColor
                  : styles.normalBorderColor,
              ]}
              value={newPassword}
              onChangeText={(text) => {
                setErrorMsg({ newPassword: "" });
                setNewPassword(text);
              }}
              secureTextEntry={secure}
              placeholder="Minimum 8 characters"
            />
            <View style={styles.eyeIconContainer}>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setSecure(!secure)}
              >
                <Ionicons
                  name={secure ? "eye-outline" : "eye-off-outline"}
                  size={25}
                  style={{ color: COLORS.foitiGrey }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ color: "red", fontSize: 11 }}>
            {errorMsg.newPassword && errorMsg.newPassword}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            Confirm Password
          </Text>
          <TextInput
            style={[
              styles.input,
              errorMsg.confirmPassword
                ? styles.errorBorderColor
                : styles.normalBorderColor,
            ]}
            value={confirmPassword}
            onChangeText={(text) => {
              setErrorMsg({ confirmPassword: "" });
              setConfirmPassword(text);
            }}
            secureTextEntry={true}
            placeholder="Minimum 8 characters"
          />
          <Text style={{ color: "red", fontSize: 11 }}>
            {errorMsg.confirmPassword && errorMsg.confirmPassword}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Change</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  box: {
    paddingBottom: 25,
  },
  oldEmail: {
    borderBottomWidth: 0.5,
    marginTop: 5,
    color: COLORS.foitiGrey,
  },
  input: {
    borderBottomWidth: 0.5,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 50,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.foiti,
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  errorBorderColor: {
    borderBottomColor: "red",
  },
  normalBorderColor: {
    borderBottomColor: COLORS.foitiGreyLight,
  },
  eyeIconContainer: {
    position: "absolute",
    zIndex: 1000,
    right: 0,
    top: 3,
  },
});
