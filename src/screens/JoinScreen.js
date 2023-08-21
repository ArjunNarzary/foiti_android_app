import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import SocialInput from "../components/SocialInput";
import { COLORS } from "../resources/theme";
import { validateForm } from "../Redux/customApis/validator";
import { useSendJoinRequestMutation } from "../Redux/services/serviceApi";
import ModalComponent from "../components/ModalComponent";

const { width, height } = Dimensions.get("window");

const JoinScreen = ({ navigation }) => {
  const [sendJoinRequest, { data, error, isLoading, isSuccess, isError }] =
    useSendJoinRequestMutation();
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setModalVisible(true);
    }
    if (isError) {
      setErrorMsg(error?.data?.message);
    }
  }, [isSuccess, isError]);

  const submit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ email });
    if (checkForm.valid) {
      await sendJoinRequest({ email, instagram, twitter, youtube, facebook });
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate("Login");
  };

  return (
    <View
      style={{
        height,
        backgroundColor: "#fff",
        padding: 35,
      }}
    >
      <View style={{ paddingTop: 60 }}>
        <Text style={{ textAlign: "center" }}>
          This app is currently "Invite Only". However, we are also accepting
          request from enthusiast travellers.
        </Text>
      </View>
      <View style={{ paddingTop: 15 }}>
        <Text style={{ textAlign: "center" }}>
          Note: Providing your social media links can help us in accepting your application faster.
        </Text>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <View>
            <Text>Email:</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMsg({ email: "" });
              }}
              style={styles.emailInput}
            />
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errorMsg?.email || errorMsg?.general}
            </Text>
          </View>
          <View style={{ paddingTop: 15, paddingBottom: 10 }}>
            <Text>Social Media Links:</Text>
          </View>

          <SocialInput
            text="Instagram"
            value={instagram}
            onChange={(text) => setInstagram(text)}
          />
          <SocialInput
            text="Twitter"
            value={twitter}
            onChange={(text) => setTwitter(text)}
          />
          <SocialInput
            text="YouTube"
            value={youtube}
            onChange={(text) => setYoutube(text)}
          />
          <SocialInput
            text="Facebook"
            value={facebook}
            onChange={(text) => setFacebook(text)}
          />
          <View style={{ paddingVertical: 60 }}>
            <TouchableOpacity
              disabled={isLoading}
              style={{
                width: "100%",
                backgroundColor: COLORS.foiti,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 15,
                borderRadius: 3,
              }}
              onPress={submit}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ fontWeight: "bold", color: "#fff" }}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ padding: 10 }} onPress={goBack}>
              <Text style={{ fontWeight: "bold" }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ModalComponent
        body="Your request has been successfully submitted."
        closeModal={closeModal}
        modalVisible={modalVisible}
        hasButton={true}
      />
    </View>
  );
};

export default JoinScreen;

const styles = StyleSheet.create({
  emailInput: {
    borderWidth: 0.8,
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 2,
    borderColor: "#ccc",
  },
});
