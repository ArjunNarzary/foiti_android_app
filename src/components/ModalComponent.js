import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "../resources/theme";
const { width, height } = Dimensions.get("screen");

const ModalComponent = ({
  header = false,
  title,
  body,
  closeModal,
  modalVisible,
  hasButton = false,
  confirmModal = false,
  confirmDelete,
  cancelDelete,
  showCloseButton = false,
  secondBody=""
}) => {
  return (
    <View>
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <TouchableOpacity onPressOut={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalMain}>
                {header && (
                  <View style={styles.modalHeaderContainer}>
                    <Text
                      style={{
                        color: "#000",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {title}
                    </Text>
                  </View>
                )}
                <View style={styles.modalBody}>
                  <Text style={{ color: "#000", textAlign: "center" }}>
                    {body}
                  </Text>
                  {secondBody ? <Text style={{ color: "#000", textAlign: "center", marginTop:15 }}>
                    {secondBody}
                  </Text> : null}
                </View>
                <View style={styles.ModalbuttonContainer}>
                  {!confirmModal && !showCloseButton && (
                    <>
                      {hasButton ? (
                        <TouchableOpacity
                          onPress={closeModal}
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                          }}
                        >
                          <Text style={{ color: "#000" }}>OK</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.ModalbuttonBox}
                          onPress={closeModal}
                        >
                          <Text style={{ color: "#000", fontWeight: "bold" }}>
                            X
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                  {confirmModal && !showCloseButton && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <TouchableOpacity onPress={confirmDelete}>
                        <Text>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelDelete}>
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {showCloseButton && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                        <Text style={{ color: "white" }}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  // STYLES FOR MODAL
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.3)",
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  modalMain: {
    width: width / 1.1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 12,
  },
  modalHeaderContainer: {
    paddingBottom: 10,
  },
  modalBody: {
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 5,
    borderRadius: 5,
  },
  ModalbuttonContainer: {
    paddingTop: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ModalbuttonBox: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  closeBtn:{
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 40,
    backgroundColor: COLORS.foiti
  }
});
