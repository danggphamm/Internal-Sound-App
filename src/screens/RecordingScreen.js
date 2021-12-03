import React, {useState, useRef} from 'react';
import { Text, TextInput, StyleSheet, View, Button, TouchableOpacity, Card, Background, Logo, Header, Title, FlatList } from "react-native";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

var newestURI = null;
var recordingList = [
	{name: "", uriAddress: ""}
];

const RecordingScreen = (props) => {
	const [recording, setRecording] = useState();
	const AudioPlayer = new Audio.Sound();
	const [recordingName, setName] = useState('');

	//List of saved recordings with name and URI
	const [recordings, setRecordings] = useState(recordingList);

	const [currentTextInput, clearInput] = useState('');

	async function startRecording() {
    try {
      if(newestURI != null){
      	FileSystem.deleteAsync(newestURI);
      }

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
    newestURI = recording.getURI();
  }

  async function replay() {
  	if(newestURI != null)
  	{
  		AudioPlayer.unloadAsync();
	    // Load the Recorded URI
	    await AudioPlayer.loadAsync({
	      uri: newestURI
	    }, {volume: 1
	    });

	    // Play the audio
	    AudioPlayer.playAsync();

		console.log("Playing Sound");
  	}
  }

  async function deleteRecording() {
      if(newestURI != null){
      	FileSystem.deleteAsync(newestURI);
      }
  }

  async function saveRecording() {
      if(newestURI != null){
      	setRecordings(recordings => [...recordings, {name : recordingName, uriAddress: newestURI}]);

      	console.debug([...recordings, {name : recordingName, uriAddress: newestURI}]);

      	clearInput('');
      	newestURI = null;
      }
  }

  	return (
     <View style={styles.page}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />

      <Button
        title={recording ? 'Recording in progress...' : 'Replay'}
        onPress={recording ? null : replay}
      />

      <Button
        title={recording ? 'Recording in progress...' : 'Delete recording'}
        onPress={recording ? null : deleteRecording}
      />

      <View style = {styles.saveButton}>
	      <Button
	        title={recording ? 'Recording in progress...' : 'Save recording as:'}
	        onPress={recording ? null : saveRecording}
	      />
	  </View>

      <View>
      	<TextInput 
      		style = {styles.background} 
      		placeholder = "Recording Name"
      		onChangeText={text => setName(text)}
      	/>
      </View>

      <FlatList
      	data = {recordings}
      	keyExtractor = { (recording) => {return recording}}
      	renderItem = {({item}) => {
      		return(
      			<Text> {item.name}</Text>
      		)
      	}
      	}
      />
    </View>
    )
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#cccccc', 
    height:50,
    flexDirection: 'row',
    width:150,
    justifyContent: 'center',
  },

  page: {
  	alignItems: 'center',
  },

  saveButton: {
  	marginTop:20,
  }
});

export default RecordingScreen;
