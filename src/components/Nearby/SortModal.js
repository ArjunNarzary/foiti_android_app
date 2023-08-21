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

const SortModal = ({ modalVisible, closeModal, sortSelected }) => {
  return (
    <View>
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <TouchableOpacity onPressOut={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalMain}>
                {/* {header && (
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
                )} */}
                <View style={styles.modalBody}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => sortSelected("popularity")}
                  >
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      Popularity
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.horLine} />
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => sortSelected("nearest")}
                  >
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      Nearest
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

export default SortModal;

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
  modalHeaderContainer: {
    paddingBottom: 10,
  },
  modalBody: {
    paddingTop: 8,
    paddingHorizontal: 8,
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
  option: {
    backgroundColor: COLORS.foitiGreyLighter,
    padding: 8,
  },
  horLine: {
    height: 4,
  },
});
