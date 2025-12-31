import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Text>Welcome to my first App</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
  },
  navButton: {
    width: 200,
    height: 50,
    backgroundColor: "coral",
    textAlign: "center",
    borderRadius: "20px"
  }
})