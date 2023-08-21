import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, { useState } from "react";
import { CheckBox } from 'react-native-elements'
import { LANGUAGES } from "../utils/constants";
import { ScrollView } from "react-native";
import { COLORS } from "../resources/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons"
const { width, height } = Dimensions.get("screen");

const LanguageModal = ({
    closeModal,
    modalVisible,
    currentLanguages,
    saveLanguages
}) => {
    const [selected, setSelected] = useState(currentLanguages);
    const languagePressed = (lng) => {
        const selectedLngArr = [...selected];
        if (selectedLngArr.includes(lng)){
            const index = selectedLngArr.indexOf(lng);
            selectedLngArr.splice(index, 1);
            setSelected(selectedLngArr);
        }else{
            selectedLngArr.push(lng);
            setSelected(selectedLngArr);
        }
    }
    return (
        <View>
            <Modal animationType="none" transparent={true} visible={modalVisible}>
                <TouchableOpacity onPressOut={closeModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalMain}>
                                <Text style={{ marginBottom:10, marginLeft:10 }}>Select Language</Text>
                                <ScrollView>
                                    {LANGUAGES.map(lng => (
                                        <CheckBox
                                            key={lng}
                                            title={lng}
                                            checkedIcon={<MaterialCommunityIcons style={{ fontSize:16 }} name="checkbox-blank" />}
                                            uncheckedIcon={<MaterialCommunityIcons style={{ fontSize:16 }} name="checkbox-blank-outline" />}
                                            checked={selected.includes(lng)}
                                            onPress={() => languagePressed(lng)}
                                        />
                                    ))}
                                </ScrollView>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => saveLanguages(selected)}>
                                       <Text style={{ fontWeight:"bold", color:COLORS.foiti }}>Done</Text>
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

export default LanguageModal;

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
        height: height / 1.5
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
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop:15
    },
    doneBtn:{
        backgroundColor:COLORS.foiti,
        paddingHorizontal:10,
        paddingVertical:2
    },
    ModalbuttonBox: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
});
