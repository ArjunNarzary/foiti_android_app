import {
  Dimensions,
  StyleSheet,
  Text,
  Touchable,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { useUpdateEmailMutation } from "../Redux/services/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Redux/slices/authSlice";
import { setItemInStore } from "../utils/handle";
import { useNavigation } from "@react-navigation/native";
import { validateForm } from "../Redux/customApis/validator";
import { useBackHandler } from "@react-native-community/hooks";

const { width, height } = Dimensions.get("screen");

const ChangeEmail = () => {
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
  //STATES
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState({});

  //SERVER API
  const [updateEmail, { data, error, isSuccess, isLoading, isError }] =
    useUpdateEmailMutation();

  //REDUX DATA
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const dispatch = useDispatch();

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
        setErrorMsg(error.data.message);
      }
    })();
  }, [isSuccess, isError]);

  //Validate email
  const isValidForm = () => {
    if (email.trim().toLowerCase() === REDUXUSER?.user?.email) {
      setErrorMsg({
        email: "Email address already in use",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ email });
    if (checkForm.valid) {
      if (isValidForm()) {
        const body = {
          email,
          token: REDUXUSER.token,
        };

        await updateEmail(body);
      }
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title="Change Email Address" isProfile={false} />
      </View>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{ color: COLORS.foitiGrey }}>Current Email Address</Text>
          <Text style={styles.oldEmail}>{REDUXUSER?.user?.email}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold" }}>New Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setErrorMsg({});
              setEmail(text);
            }}
            keyboardType="email-address"
          />
          <Text style={{ color: "red", fontSize: 11 }}>
            {(errorMsg && errorMsg.email) || errorMsg.general}
          </Text>
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

export default ChangeEmail;

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
