import {
  Dimensions,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useGetUpdateNotificationQuery } from "../Redux/services/serviceApi";
import { COLORS } from "../resources/theme";
import activeVersion from "../utils/appVersion";
const { width, height } = Dimensions.get("screen");

const UpdateNotification = () => {
  const [notification, setNotification] = useState(false);
  const [resData, setResData] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);
  const {
    data: updateNotData,
    isSuccess: updateNotIsSuccess,
    isError: updateNotIsError,
  } = useGetUpdateNotificationQuery({ refetchOnMountOrArgChange: true });

  //SHOW NOTIFICATION
  useEffect(() => {
    if (updateNotIsSuccess) {
      if (updateNotData.updateNotification?._id != undefined) {
        setResData(updateNotData?.updateNotification);
        if (
          parseFloat(activeVersion) <=
          parseFloat(updateNotData?.updateNotification?.appVersion)
        ) {
          setNotification(true);
        }
      }
    }
  }, [updateNotIsSuccess, updateNotIsError]);

  if (notification == false) {
    return null;
  }

  const handlePress = () => {
    if (resData.redirectLink != null) {
      Linking.openURL(resData.redirectLink);
    }
  };

  const modalPressed = () => {
    handlePress();
  };

  return (
    <View>
      {updateNotData?.updateNotification?.forced ? (
        <Modal animationType="none" visible={modalVisible} transparent={true}>
          <TouchableOpacity>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalMain}>
                  <View style={styles.modalBody}>
                    <Text style={{ color: "#000", textAlign: "center", fontSize: 16, fontWeight:"bold" }}>
                      {resData.body}
                    </Text>
                  </View>
                  <View style={styles.ModalbuttonContainer}>
                    {resData.showButton && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          width: "100%",
                          paddingTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          onPress={modalPressed}
                          style={{
                            paddingHorizontal: 25,
                            paddingVertical: 12,
                            borderRadius: 5,
                            borderRadius: 40,
                            backgroundColor: COLORS.foiti,
                          }}
                        >
                          <Text
                            style={{ fontWeight: "bold", color: "#fff" }}
                          >
                            {resData.buttonText}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
      ) : (
        <View
          style={{
            // backgroundColor: "#ededed",
            paddingTop:10,
            borderBottomColor: "#fff",
            borderBottomWidth: 5,
            borderRadius:30,
            marginHorizontal:10
          }}
        >
          <View
            style={{
              paddingHorizontal: 25,
              paddingVertical: 20,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              {updateNotData?.updateNotification?.body}
            </Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
              }}
            >
              {updateNotData?.updateNotification?.showButton && (
                <TouchableOpacity
                  onPress={handlePress}
                  style={{
                    paddingHorizontal: 25,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: COLORS.foiti }}>
                    {updateNotData?.updateNotification?.buttonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default UpdateNotification;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  modalMain: {
    width: width / 1.1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 40,
    borderRadius: 12,
  },
});
