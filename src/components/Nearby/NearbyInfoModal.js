import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { COLORS } from "../../resources/theme";
const { width, height } = Dimensions.get("screen");

const NearbyInfoModal = ({ modalVisible, closeModal, showSetting, goBack, body }) => {
  return (
    <View>
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <TouchableOpacity onPressOut={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalMain}>
                <View style={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    {body}
                  </Text>
                </View>
                <View style={styles.modalBody}>
                  <TouchableOpacity
                    style={styles.accessButton}
                    onPress={showSetting}
                  >
                    <Text
                      style={{ color: "#fff", textAlign: "center", padding: 8 }}
                    >
                      Grant Access
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={goBack}>
                    <Text
                      style={{ color: COLORS.foitiGrey, textAlign: "center" }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NearbyInfoModal;

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
    borderRadius: 5,
  },
  modalBody: {
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  accessButton: {
    width: "50%",
    backgroundColor: COLORS.foitiGrey,
    borderRadius: 30,
    marginBottom: 25,
  },
});
