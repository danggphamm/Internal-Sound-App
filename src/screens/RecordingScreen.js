import React, {useState, useRef} from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity, Card, Background, Logo, Header, Title } from "react-native";
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

const RecordingScreen = (props) => {
	const [recording, setRecording] = React.useState();
	const AudioPlayer = new Audio.Sound();

	async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const ruri = recording.getURI(); 

    // Load the Recorded URI
    await AudioPlayer.loadAsync({
      uri: ruri
    }, {volume: 1
    });

    // Play the audio
    AudioPlayer.playAsync();

	console.log("Playing Sound");
  }

  	return (
     <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
    )
};

export default RecordingScreen;
