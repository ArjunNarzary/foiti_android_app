import React, { useState } from "react";
import { Dimensions, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Text, View, StatusBar } from "react-native";
import { Slider } from "@rneui/themed";
import { BottomSheet } from "react-native-elements";
import { COLORS } from "../../resources/theme";

const { width, height } = Dimensions.get("screen");

const FilterBottomSheet = ({
  modalVisible,
  closeModal,
  sortSelected,
  sortByText,
  distanceText,
}) => {
  const [sortValue, setSortValue] = useState(sortByText);
  const [sortDistance, setSortDistance] = useState(distanceText);

  const applyFilter = () => {
    sortSelected(sortValue, sortDistance);
  };

  return (
    <BottomSheet animationType="none" isVisible={modalVisible}>
      <TouchableOpacity
        style={{
          width,
          height: height - StatusBar.currentHeight,
          alignItems: "baseline",
        }}
        onPress={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.topLineContainer}>
            <View style={styles.topLine} />
          </View>
          <TouchableWithoutFeedback>
            <View style={styles.modalMain}>
              <View>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Sort By:
                </Text>
                <View style={styles.modalBody}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          sortValue === "popularity"
                            ? COLORS.foitiGrey
                            : "transparent",
                      },
                    ]}
                    onPress={() => setSortValue("popularity")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        sortValue === "popularity"
                          ? styles.selectedOptionText
                          : "",
                      ]}
                    >
                      Popularity
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.horLine} />
                  <TouchableOpacity
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          sortValue === "nearest"
                            ? COLORS.foitiGrey
                            : "transparent",
                      },
                    ]}
                    onPress={() => setSortValue("nearest")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        sortValue === "nearest"
                          ? styles.selectedOptionText
                          : "",
                      ]}
                    >
                      Nearest
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.distanceContainer}>
                <View style={styles.maxDistanceText}>
                  <Text style={{ fontWeight: "bold" }}>Maximum Distance:</Text>
                  <Text style={{ fontWeight: "bold" }}>{sortDistance} KMS</Text>
                </View>
                <Slider
                  value={sortDistance}
                  onValueChange={(value) => setSortDistance(value)}
                  maximumValue={99}
                  minimumValue={5}
                  step={1}
                  allowTouchTrack
                  minimumTrackTintColor={COLORS.foitiGrey}
                  trackStyle={{ height: 3, backgroundColor: "transparent" }}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: "transparent",
                  }}
                  thumbProps={{
                    children: <View style={styles.circle} />,
                  }}
                />
              </View>
              <View style={styles.applyContainer}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilter}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </BottomSheet>
  );
};

export default FilterBottomSheet;

const styles = StyleSheet.create({
  // STYLES FOR MODAL
  modalContainer: {
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "center",
    minHeight: 40,
    width,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    paddingBottom: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
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
  topLineContainer: {},
  topLine: {
    height: 3,
    width: 30,
    borderRadius: 3,
    backgroundColor: COLORS.foitiGreyLight,
  },
  option: {
    borderColor: COLORS.foitiGrey,
    borderWidth: 1,
    padding: 8,
    width: width / 2 - 40,
    borderRadius: 20,
  },
  optionText: {
    textAlign: "center",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  horLine: {
    height: 4,
  },
  maxDistanceText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceContainer: {
    marginTop: 30,
  },
  circle: {
    height: 20,
    width: 20,
    backgroundColor: COLORS.foiti,
    borderRadius: 12,
  },

  applyButton: {
    backgroundColor: COLORS.foiti,
    padding: 15,
    borderRadius: 30,
    width: "60%",
  },
  applyContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
});
