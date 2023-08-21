import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../../resources/theme";

const { width, height } = Dimensions.get("screen");

const CaptionEditior = ({
  value,
  setValue,
  error,
  profile = `profile_picture.jpg`,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${process.env.BACKEND_URL}/image/${profile}` }}
          style={styles.image}
        />
      </View>
      <View
        style={{
          width: "100%",
        }}
      >
        <TextInput
          placeholder="Write a description..."
          value={value}
          onChangeText={setValue}
          multiline={true}
          style={[
            styles.richEditor,
            error ? styles.errorBorderColor : styles.normalBorderColor,
            { textAlignVertical: "top" },
          ]}
        />
        <Text style={{ color: "red", fontSize: 11, marginLeft: 10 }}>
          {error}
        </Text>
      </View>
    </View>
  );
};

export default CaptionEditior;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width,
    alignItems: "flex-start",
  },
  imageContainer: {
    height: 41,
    width: 41,
    borderRadius: 41 / 2,
    backgroundColor: COLORS.foitiGreyLight,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    resizeMode: "cover",
    alignItems: "center",
  },
  richEditor: {
    width: width - 72,
    borderColor: COLORS.foitiGreyLight,
    borderBottomWidth: 0.3,
    marginLeft: 10,
    marginTop: 5,
    color: "#000",
    borderRadius: 2,
    padding: 2,
  },
  rich: {
    fontSize: 18,
  },
  errorBorderColor: {
    borderBottomColor: "red",
  },
  normalBorderColor: {
    borderBottomColor: COLORS.foitiGreyLight,
  },
});
