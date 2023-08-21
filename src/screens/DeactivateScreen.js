import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import ModalComponent from "../components/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { useDeactivateUserMutation } from "../Redux/services/serviceApi";
const { width, height } = Dimensions.get("window");
import { removeItemFromStore } from "../utils/handle";
import { removeUser } from "../Redux/slices/authSlice";
import { useBackHandler } from "@react-native-community/hooks";

const DeactivateScreen = ({ navigation }) => {
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const reduxUser = useSelector((state) => state.AUTHUSER);
  const [deactivateUser, { data, isLoading, isSuccess, isError, error }] =
    useDeactivateUserMutation();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

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

  //FORM VALIDATION
  const isValidForm = () => {
    if (!password.trim()) {
      setErrorMsg("Please enter your password");
      return false;
    }
    if (password.trim().length < 8) {
      setErrorMsg("Please enter valid password");
      return false;
    }
    return true;
  };

  const closeConfirmModal = () => {
    setPassword("");
    setConfirmModalShow(false);
  };

  const confirmDeactivate = (e) => {
    setConfirmModalShow(false);
    e.preventDefault();
    if (isValidForm()) {
      const body = {
        password,
        token: reduxUser?.token,
      };
      deactivateUser(body);
    }
  };

  const logout = async () => {
    setMessage("Your account has been deactivated");
    setTimeout(() => {
      setMessage("Logging out ...");
    }, 500);

    setTimeout(async () => {
      await removeItemFromStore("userData");
      dispatch(removeUser());
      navigation.navigate("AuthNavigation");
    }, 500);
  };

  useEffect(() => {
    if (isSuccess) {
      logout();
    }

    if (isError) {
      setErrorMsg(
        error?.data?.message?.password ||
          "Something went wrong please try again."
      );
      setConfirmModalShow(false);
    }
  }, [isSuccess, isError]);

  if (isLoading || isSuccess) {
    return (
      <View
        style={{
          flex: 1,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
        <Text>{isLoading ? "Deactivating your account.." : message}</Text>
      </View>
    );
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: "#fff", height }}>
        <PostPlaceHeader title="Deactivate" />
        <View style={{ padding: 20 }}>
          <Text style={styles.textSize}>Hi {reduxUser?.user?.name},</Text>
          <Text style={styles.textSize}>
            We are sorry to know you’d like to deactivate your account.
          </Text>
          <Text style={styles.textSize}>
            If you deactivate your account, it will remain deactivated until it's permanently deleted automatically from the database after 30 days. However, in case you change your mind, you can always come back within this 30 days and reactivate your account just by logging in, until then your account or personal data will no longer be visible to other users.
          </Text>
          <Text style={styles.textSize}>
            After getting permanently deleted, every post, photo, comment, and all your data, including your email address and username will be removed from the database. You will be required to register again to use the service
          </Text>
          <View style={styles.inputContainer}>
            <Text>Please enter your password to continue</Text>
            <TextInput
              style={[
                styles.input,
                errorMsg != ""
                  ? styles.errorBorderColor
                  : styles.defaultBorderColor,
              ]}
              value={password}
              onChangeText={(text) => {
                setErrorMsg("");
                setPassword(text);
              }}
              placeholder="Enter your password"
              secureTextEntry={true}
            />
            <Text style={{ color: "red" }}>{errorMsg}</Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 150,
            right: 0,
            width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.foiti,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 4,
            }}
            onPress={() => setConfirmModalShow(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Deactivate
            </Text>
          </TouchableOpacity>
        </View>

        <ModalComponent
          body="Are you sure you want to deactivate your account?"
          closeModal={closeConfirmModal}
          modalVisible={confirmModalShow}
          confirmModal={true}
          confirmDelete={confirmDeactivate}
          cancelDelete={closeConfirmModal}
        />
      </View>
    </ScrollView>
  );
};

export default DeactivateScreen;

const styles = StyleSheet.create({
  textSize: {
    marginBottom: 15,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 3,
  },
  defaultBorderColor: {
    borderColor: COLORS.foitiGreyLight,
  },
  errorBorderColor: {
    borderColor: "red",
  },
});
