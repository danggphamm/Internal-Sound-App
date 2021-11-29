import React from "react";
import { Text, StyleSheet, View, Button, TouchableOpacity } from "react-native";

const HomeScreen = (props) => {
  return <View>
  	<Text style={styles.text}>Homescreen</Text>

    <Button 
      onPress={() => {props.navigation.navigate("Recording")}}
      title = {"Recording Screen"}
    />

    <Button 
      onPress={() => {props.navigation.navigate("Listening")}}
      title = {"Listening Screen"}
    />

    <Button 
      onPress={() => {props.navigation.navigate("Editing")}}
      title = {"Editing Screen"}
    />
  </View>
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

export default HomeScreen;
