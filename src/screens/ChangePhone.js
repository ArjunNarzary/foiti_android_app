import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { useDispatch, useSelector } from "react-redux";
import { useUpdatePhoneMutation } from "../Redux/services/serviceApi";
import { addUser } from "../Redux/slices/authSlice";
import { setItemInStore } from "../utils/handle";
import { useNavigation } from "@react-navigation/native";
import { validateForm } from "../Redux/customApis/validator";
import { useBackHandler } from "@react-native-community/hooks";

const { width, height } = Dimensions.get("screen");

const ChangePhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const navigation = useNavigation();

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
      return true;
    }
  });

  const [updatePhone, { data, error, isSuccess, isLoading, isError }] =
    useUpdatePhoneMutation();

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        const resData = {
          user: data.user,
          token: REDUXUSER.token,
        };

        dispatch(addUser(resData));
        await setItemInStore("userData", resData);
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate("Settings");
        }
      }
      if (isError) {
        setErrorMsg(
          error?.data?.message?.phoneNumber || error?.data?.message?.general
        );
      }
    })();
  }, [isSuccess, isError]);

  //Validate email
  const isValidForm = () => {
    if (phoneNumber.trim() === REDUXUSER?.user?.phoneNumber) {
      setErrorMsg("Phone number already in use");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ phoneNumber });
    if (checkForm.valid) {
      if (isValidForm()) {
        const body = {
          phoneNumber,
          token: REDUXUSER?.token,
        };

        await updatePhone(body);
      }
    } else {
      setErrorMsg(checkForm.errors.phoneNumber);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal:7 }}>
        <PostPlaceHeader title="Change Phone Number" isProfile={false} />
      </View>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{ color: COLORS.foitiGrey }}>Current Phone Number</Text>
          <Text style={styles.oldEmail}>{REDUXUSER?.user?.phoneNumber}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold" }}>New Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => {
              setErrorMsg("");
              setPhoneNumber(text);
            }}
            keyboardType="number-pad"
            placeholder="Enter your 10 digit phone number"
          />
          <Text style={{ color: "red", fontSize: 11 }}>{errorMsg}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading ? true : false}
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

export default ChangePhone;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  box: {
    paddingBottom: 25,
  },
  oldEmail: {
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.5,
    marginTop: 5,
    color: COLORS.foitiGrey,
  },
  input: {
    borderBottomColor: COLORS.foitiGrey,
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
});
