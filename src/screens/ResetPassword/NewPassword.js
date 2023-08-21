import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";

import BoxInput from "../../components/BoxInput";
import { images, STYLES, COLORS } from "resources";
import { useNavigation } from "@react-navigation/native";
import { validateForm } from "../../Redux/customApis/validator";
import PostPlaceHeader from "../../components/Header/PostPlaceHeader";
import ModalComponent from "../../components/ModalComponent";
import { useCreateNewPasswordMutation } from "../../Redux/services/serviceApi";
import { addUser } from "../../Redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { setItemInStore } from "../../utils/handle";
const { width, height } = Dimensions.get("window");

const NewPassword = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [createNewPassword, { data, error, isLoading, isSuccess, isError }] =
    useCreateNewPasswordMutation();

  const handleReset = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ password, confirmPassword });
    if (checkForm.valid) {
      const data = { password, confirmPassword, id };
      createNewPassword(data);
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        setModalVisible(true);
      }

      if (isError) {
        if (error.status == 400 || error.status == 500) {
          setModalVisible(true);
        } else {
          setErrorMsg(error?.data?.message);
        }
      }
    })();
  }, [isSuccess, isError]);

  const closeModal = async () => {
    setModalVisible(false);
    if (isSuccess) {
      const resData = {
        user: data.user,
        token: data.token,
      };
      dispatch(addUser(resData));
      await setItemInStore("userData", resData);
      navigation.navigate("WelcomeStack");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={{ width, height, backgroundColor: "#fff" }}>
      <PostPlaceHeader title="New Password" />
      <View style={{ paddingHorizontal: 40 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 220,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: COLORS.foitiGrey,
            }}
          >
            Enter Your New Password
          </Text>
        </View>
        <View>
          <BoxInput
            value={password}
            label="New Password"
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
        <View style={{ paddingVertical: 20 }}>
          <TouchableOpacity
            style={[STYLES.button, { backgroundColor: COLORS.foiti }]}
            onPress={handleReset}
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={STYLES.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* SIGN UP BUTTON END */}
      </View>

      <View>
        <ModalComponent
          header={false}
          title=""
          body={
            isSuccess
              ? "Password has been reset successfully."
              : "Your password reset token has been expired. Please try again"
          }
          closeModal={closeModal}
          modalVisible={modalVisible}
          hasButton={true}
        />
      </View>
    </View>
  );
};

export default NewPassword;
