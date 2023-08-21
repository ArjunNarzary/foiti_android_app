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
import { COLORS } from "../../resources/theme";
const { width, height } = Dimensions.get("screen");

const MeetupModal = ({
    body,
    closeModal,
    modalVisible,
    openMeetup
}) => {
    return (
        <View>
            <Modal animationType="none" transparent={true} visible={modalVisible}>
                <TouchableOpacity onPressOut={closeModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalMain}>
                                <View style={styles.modalBody}>
                                    <Text style={{ color: "#000", textAlign: "center", fontWeight:"bold" }}>
                                        {body}
                                    </Text>
                                </View>
                                <View style={styles.ModalbuttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => openMeetup()}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 30,
                                            backgroundColor:COLORS.foiti,
                                            borderRadius:30
                                        }}
                                    >
                                        <Text style={{ color: "#fff" }}>Continue</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 15,
                                            marginTop:10
                                        }}
                                    >
                                        <Text style={{ color: COLORS.foitiGrey }}>Done</Text>
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

export default MeetupModal;

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
});
