import React, {useState, useRef} from 'react';
import { Text, TextInput, StyleSheet, View, Button, TouchableOpacity, Card, Background, Title, FlatList, Image } from "react-native";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

var newestURI = null;
var recordingButtonImg = require('../../assets/onrecording.png');
const recordingImage = require('../../assets/recording.png');
const onRecordingImage = require('../../assets/onrecording.png');

// List of the recordings
var recordingList = [
];

const RecordingScreen = (props) => {
	// State of actions: recording, playing, ...
	const [recordingImg, setRecordingImg] = useState(require('../../assets/recording.png'));

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

      setRecordingImg(require('../../assets/onrecording.png'));
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  // Stop recording
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    setRecordingImg(require('../../assets/recording.png'));
  	let recordingButtonImg = recording ? recordingImage : onRecordingImage;
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
      <View>
	      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
	      	<Image style = {styles.recordingImage} source = {recordingImg}/>
	      </TouchableOpacity>
	  </View>

	  <View style = {styles.replayAndDelete}>
		  <View >
		      <TouchableOpacity onPress={recording ? null : replay}>
		      	<Image style = {styles.image} source = {require('../../assets/replay.png')}/>
		      </TouchableOpacity>
		  </View>

		  <View>
		      <TouchableOpacity onPress={recording ? null : deleteRecording}>
		      	<Image style = {styles.image} source = {require('../../assets/delete.png')}/>
		      </TouchableOpacity>
		  </View>
	  </View>

      <View>
      	  <View>
		      <TouchableOpacity onPress={recording ? null : saveRecording}>
		      	<Image style = {styles.image} source = {require('../../assets/save.png')}/>
		      </TouchableOpacity>
	  	  </View>
	  </View>

	  <View stye = {styles.text}>
	      <Text>{savingDialogue}</Text>
	  </View>

      <View>
      	<TextInput 
      		style = {styles.background} 
      		placeholder = "Recording's name"
      		onChangeText={text => setName(text)}
      	/>
      </View>

      <FlatList
      	data = {recordings}
      	keyExtractor = { (recording) => {return recording}}
      	renderItem = {({item}) => {
      		return(
      			<View >
      				<TouchableOpacity
      					style = {styles.trackList}
      					onPress = {() => replaySpecific(item.uriAddress)}
      				>
				        <Text style = {styles.trackListText}> {item.name}</Text>
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
  	flex: 1,
  	backgroundColor: '#0571b0',
  },

  saveButton: {
  	marginTop:20,
  },

  replayBox: {
  	marginTop: 10,
    backgroundColor: '#cccccc',
    width:150,
    alignSelf: 'flex-start',
    borderWidth: 5,
  },

  text:{
  	textAlign: 'center',
  },

  image: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  recordingImage: {
    justifyContent: 'center',
    width: 75,
    height: 75,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  replayAndDelete: {
  	flexDirection: 'row',
  },

  trackList:{
  	alignItems: 'center',
    flex: 1 
  },
  
  trackListText:{
    fontSize: 20,
    margin: 10
  }
});

export default RecordingScreen;
