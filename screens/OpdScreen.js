import React from "react";
import { View, Text, Button, StyleSheet} from "react-native";

function OpdScreen() {
    return(
        <View style={styles.container}>
            <Text>This is OpdScreen.</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default OpdScreen;