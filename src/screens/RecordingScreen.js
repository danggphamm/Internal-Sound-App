import React, {useState, useRef} from 'react';
import { Text, TextInput, StyleSheet, View, Button, TouchableOpacity, Card, Background, Title, FlatList } from "react-native";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

var newestURI = null;

// List of the recordings
var recordingList = [
];

const RecordingScreen = (props) => {
	// State of actions: recording, playing, ...
	const [recording, setRecording] = useState();

	// Name of the current ecording going to be saved
	const [recordingName, setName] = useState('');

	// The saving dialogue. "Saved" if sucessfully save the recording. "There's lready a file with the same name" if dupicate name. 
	const [savingDialogue, setDialogue] = useState();

	// List of saved recordings with name and URI
	const [recordings, setRecordings] = useState(recordingList);

	// Current text in the text input box
	const [currentTextInput, clearInput] = useState('');

	// Audio player
	const AudioPlayer = new Audio.Sound();

	// Record
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

  // Stop recording
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    newestURI = recording.getURI();
  }

  // Replay the recording
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
  	}
  }

  // Replay each recording
  async function replaySpecific(inputURI) {
  	if(inputURI != null)
  	{
  		AudioPlayer.unloadAsync();
	    // Load the Recorded URI
	    await AudioPlayer.loadAsync({
	      uri: inputURI
	    }, {volume: 1
	    });

	    // Play the audio
	    AudioPlayer.playAsync();
  	}
  }

  async function deleteRecording() {
      if(newestURI != null){
      	FileSystem.deleteAsync(newestURI);
      }
  }

  async function saveRecording() {
  	// Check if the name already exist. If not, save the recording as the input name
  	if(!recordings.some(item => recordingName === item.name)){
      if(newestURI != null ){
      	setRecordings(recordings => [...recordings, {name : recordingName, uriAddress: newestURI}]);
      	setDialogue("Saved!");

      	console.debug([...recordings, {name : recordingName, uriAddress: newestURI}]);

      	clearInput('');
      	newestURI = null;
      }
    }

    // Else notify the user that the name is duplicate
    else{
    	setDialogue("Duplicate name! Please choose another name!");
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

	  <View stye = {styles.text}>
	      <Text>{savingDialogue}</Text>
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
      			<View style = {styles.replayBox}>
      				<TouchableOpacity
      					onPress = {() => replaySpecific(item.uriAddress)}
      				>
				        <Text style = {styles.text}> {item.name}</Text>
				    </TouchableOpacity>
      				
      			</View>
      		)
      	}
      	}
      />
    </View>
    )
};

const styles = StyleSheet.create({
  background: {
  	textAlign: 'center',
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
  },

  replayBox: {
  	marginTop: 10,
    backgroundColor: '#cccccc',
    width:150,
    justifyContent: 'center',
    borderWidth: 5,
  },

  text:{
  	textAlign: 'center',
  }
});

export default RecordingScreen;
