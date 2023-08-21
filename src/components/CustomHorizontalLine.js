import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../resources/theme";

const CustomHorizontalLine = ({ middleText }) => {
  return (
    <>
      <View style={styles.container}>
        <View
          style={{ flex: 1, height: 1, backgroundColor: COLORS.foitiGrey }}
        />
        <View>
          <Text
            style={{ textAlign: "center", color: COLORS.foitiGrey, marginHorizontal:5 }}
          >
            {middleText}
          </Text>
        </View>
        <View
          style={{ flex: 1, height: 1, backgroundColor: COLORS.foitiGrey }}
        />
      </View>
    </>
  );
};

export default CustomHorizontalLine;

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    alignItems:"center",
    marginVertical:40
  }
})
