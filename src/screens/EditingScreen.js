import React from "react";
import { Text, StyleSheet, View, Button, TouchableOpacity } from "react-native";

const EditingScreen = (props) => {
  return <View>
  	<Text style={styles.text}>Welcome to the editing screen!</Text>

  </View>
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

export default EditingScreen;
