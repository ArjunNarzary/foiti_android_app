import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { useUpdateUsernameMutation } from "../Redux/services/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Redux/slices/authSlice";
import { setItemInStore } from "../utils/handle";
import { useNavigation } from "@react-navigation/native";
import { validateForm } from "../Redux/customApis/validator";
import { useBackHandler } from "@react-native-community/hooks";

const { width, height } = Dimensions.get("screen");

const ChangeUsername = () => {
  const navigation = useNavigation();
  //STATES
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  //SERVER API
  const [updateUsername, { data, error, isSuccess, isLoading, isError }] =
    useUpdateUsernameMutation();

  //REDUX DATA
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        const resData = {
          user: data?.user,
          token: REDUXUSER?.token,
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
        setErrorMsg(error?.data?.message?.username || error?.data?.message?.general);
      }
    })();
  }, [isSuccess, isError]);

  //Validate email
  const isValidForm = () => {
    if (username.trim().toLowerCase() === REDUXUSER?.user?.username) {
      setErrorMsg("Username already in use");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      const checkForm = validateForm({ username });
      if (checkForm.valid) {
        if (isValidForm()) {
          const body = {
            username,
            token: REDUXUSER.token,
          };

          await updateUsername(body);
        }
      } else {
        setErrorMsg(checkForm.errors.username);
      }
    })();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal:7 }}>
        <PostPlaceHeader title="Change Username" isProfile={false} />
      </View>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{ color: COLORS.foitiGrey }}>Current Username</Text>
          <Text style={styles.oldEmail}>{REDUXUSER?.user?.username}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{ fontWeight: "bold" }}>New Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => {
              setErrorMsg("");
              setUsername(text);
            }}
            keyboardType="email-address"
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

export default ChangeUsername;

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
