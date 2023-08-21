import { StyleSheet, Text, View } from "react-native";

const EmptyComponent = ({ text = "post" }) => {
  return (
    <View style={styles.container}>
      <Text>No {text} to show</Text>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    alignItems: "center",
  },
});
