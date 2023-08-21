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
import { useCheckResetPasswordOtpMutation } from "../../Redux/services/serviceApi";
import ModalComponent from "../../components/ModalComponent";

const { width, height } = Dimensions.get("window");
const Otp = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [otpId, setOtpId] = useState(id);
  const [wrongEntries, setWrongEntries] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const [
    checkResetPasswordOtp,
    { data, error, isLoading, isSuccess, isError },
  ] = useCheckResetPasswordOtpMutation();

  const isValidForm = () => {
    if (!otp.trim()) {
      setErrorMsg({ otp: "Please enter otp" });
      return false;
    }
    if (otp.trim().length != 6 || isNaN(parseInt(otp))) {
      setErrorMsg({ otp: "You have entered invalid otp" });
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate("New Password", { id: data.token });
    }
    if (isError) {
      if (wrongEntries < 5 || error.status == 400) {
        setWrongEntries((wrongEntries) => wrongEntries + 1);
        setErrorMsg(error?.data?.message);
      } else {
        setModalVisible(true);
      }
    }
  }, [isSuccess, isError]);

  const submit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const data = { otp, id: otpId };
      await checkResetPasswordOtp(data);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate("Login");
  };
  return (
    <View style={{ height, width, backgroundColor: "#fff" }}>
      <PostPlaceHeader title="Enter OTP" />
      <View style={{ paddingHorizontal: 40, paddingTop: 80 }}>
        <View style={{ paddingVertical: 20 }}>
          <Text style={{ textAlign: "center" }}>
            Please enter the OTP sent to your registered email address.
          </Text>
        </View>
        <View>
          <BoxInput
            value={otp}
            label="Enter OTP"
            keyboardType="number-pad"
            setValue={(value) => {
              setErrorMsg({ otp: "" });
              setOtp(value);
            }}
            isPassword={false}
            error={errorMsg?.otp || errorMsg?.general}
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
              <Text style={STYLES.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ModalComponent
          header={true}
          title="Token Expired"
          body="Your token for password reset has been expired. Please try again."
          closeModal={closeModal}
          modalVisible={modalVisible}
          hasButton={true}
        />
      </View>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({});
