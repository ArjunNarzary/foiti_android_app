import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { STYLES, COLORS } from "../resources/theme";
import BottomLineInput from "../components/BottomLineInput";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAddNameMutation } from "../Redux/services/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromStore, setItemInStore } from "../utils/handle";
import { addUser, removeUser } from "../Redux/slices/authSlice";
import { validateForm } from "../Redux/customApis/validator";

const Welcome = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [isMoreThanFiveChar, setIsMorethanFiveChar] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [addName, { data, error, isLoading, isError, isSuccess }] =
    useAddNameMutation();

  const REDUXDATA = useSelector((state) => state.AUTHUSER);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        const resData = {
          user: data.user,
          token: REDUXDATA.token,
        };
        dispatch(addUser(resData));
        await setItemInStore("userData", resData);
        navigation.navigate("Home Navigation Stack");
      }
      if (isError) {
        if (
          error.status === 400 ||
          error.status === 403 ||
          error.status === 401
        ) {
          dispatch(removeUser());
          await removeItemFromStore("userData");
          navigation.navigate("AuthNavigation");
        }
        setErrorMsg(error.data.message);
      }
    })();
  }, [isError, isSuccess]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ name });

    if (checkForm.valid) {
      const body = {
        name,
        token: REDUXDATA.token,
      };

      await addName(body);
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  return (
    <KeyboardAvoidingView style={tw`flex-1 bg-white px-10`}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 220,
        }}
      >
        <Text style={[tw`py-7`, STYLES.welcomeHeader]}>Welcome to Foiti</Text>

        <Text style={[tw`text-center`, STYLES.text]}>
          In order to complete your profile we would like you to enter your
          name.
        </Text>
      </View>
      <View style={tw`pt-5 pb-30`}>
        <BottomLineInput
          value={name}
          label="Name"
          setValue={(value) => {
            setErrorMsg({ name: "" });
            setName(value);
          }}
          error={
            errorMsg?.name
              ? errorMsg.name
              : errorMsg?.general
              ? errorMsg.general
              : ""
          }
        />

        <View>
          {isMoreThanFiveChar && (
            <View style={styled.loader}>
              {isLoading ? (
                <ActivityIndicator color="#646161" />
              ) : (
                <Feather
                  name="check"
                  style={{ fontSize: 18, color: "#02BC36" }}
                />
              )}
            </View>
          )}
        </View>
      </View>

      {/* SIGN UP BUTTON START */}
      <View style={tw`py-4`}>
        <TouchableOpacity
          onPress={onSubmit}
          style={[STYLES.button, { backgroundColor: COLORS.foiti }]}
          disabled={isLoading ? true : false}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={STYLES.buttonText}>Complete</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* SIGN UP BUTTON END */}
    </KeyboardAvoidingView>
  );
};

export default Welcome;

const styled = StyleSheet.create({
  loader: {
    position: "absolute",
    right: 5,
    top: 14,
    color: "#000",
  },
});
