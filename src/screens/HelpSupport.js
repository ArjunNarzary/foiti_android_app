import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { Fontisto, AntDesign } from "@expo/vector-icons";
import { useSendHelpQueryMutation } from "../Redux/services/serviceApi";
import { validateForm } from "../Redux/customApis/validator";
import ModalComponent from "../components/ModalComponent";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";

const HelpSupport = () => {
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [sendHelpQuery, { data, isSuccess, isError, isLoading, error }] =
    useSendHelpQueryMutation();

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

  useEffect(() => {
    setIsUnmounted(false);
    return () => {
      setIsUnmounted(true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      if (!isUnmounted) {
        setErrorMsg("");
        setModalVisible(true);
      }
    }
    if (isError) {
      if (!isUnmounted) {
        setErrorMsg(error.data.message.query || error.data.message.general);
      }
    }
  }, [isSuccess, isError]);

  //HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ query });
    if (checkForm.valid) {
      const body = {
        query,
        token: REDUXUSER.token,
      };

      await sendHelpQuery(body);
    } else {
      setErrorMsg(checkForm.errors.query);
    }
  };

  const closeModal = () => {
    if (!isUnmounted) {
      setModalVisible(false);
      setQuery("");
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Settings");
    }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title="Help & Support" isProfile={false} />
      </View>
      <View style={styles.container}>
        <View>
          <View style={styles.messageConatiner}>
            <AntDesign name="questioncircleo" style={styles.questionIcon} />
            <Text
              style={{
                textAlign: "center",
                color: COLORS.foitiGrey,
                fontSize: 25,
                marginTop: 10,
                // fontWeight: "bold",
              }}
            >
              How can we help you?
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Your query"
              multiline={true}
              numberOfLines={5}
              maxLength={3000}
              onChangeText={(text) => {
                setErrorMsg("");
                setQuery(text);
              }}
              style={styles.input}
            />
            <Text style={{ color: "red", fontSize: 11 }}>{errorMsg}</Text>
          </View>
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            <Fontisto name="email" style={styles.icon} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={{ textAlign: "center" }}>Send us an email</Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              support@foiti.com
            </Text>
          </View>
        </View>
      </View>
      <ModalComponent
        body="We have received your query. Our support team will get back to you as soon as possible"
        closeModal={closeModal}
        modalVisible={modalVisible}
        hasButton={true}
      />
    </ScrollView>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingVertical: 20,
  },
  messageConatiner: {
    alignItems: "center",
    paddingTop: 10,
  },
  questionIcon: {
    fontSize: 50,
    color: COLORS.foitiGrey,
  },
  input: {
    borderWidth: 0.5,
    borderColor: COLORS.foitiGrey,
    textAlignVertical: "top",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },

  submitContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: COLORS.foiti,
    paddingHorizontal: 55,
    paddingVertical: 12,
    borderRadius: 21,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 150,
  },
  iconContainer: {
    backgroundColor: "#ededed",
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70 / 2,
  },
  icon: {
    fontSize: 35,
    color: COLORS.foitiGrey,
  },
  infoContainer: {
    paddingVertical: 15,
  },
});
