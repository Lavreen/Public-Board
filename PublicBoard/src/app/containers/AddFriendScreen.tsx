import React, {FC, useState, useEffect} from 'react';
import {
  FlatList,
  AppRegistry,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Linking,
  StyleProp,
} from 'react-native';

import { useWindowDimensions } from 'react-native';
import {addFriend, Friend} from "../redux/FriendsReducer"
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

interface Props {
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
}

interface Props {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
}

function onSuccess(e:any): void {
  Linking.openURL(e.data).catch(err =>
    console.error('An error occured', err)
  );
};

interface CamProps {
  camStyle: any,
  myFunction: (arg: string) => void
}

const ScannerScreen: FC<{props:CamProps}> = ({props}) =>{

  return (
    <QRCodeScanner cameraStyle={[props.camStyle, {height: "70%"}]}
      onRead={(e) => {props.myFunction(e.data)}}
      flashMode={RNCamera.Constants.FlashMode.torch}
      ratio={"4:3"}
    />
  );

}


const AddFriendScreen: FC = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [inputShown, setInputShown] = useState<boolean>(false)
  const [searchInput, setsearchInput] = useState<string>("")
  const [nameInput, setNameInput] = useState<string>("")
  const [pubKeyInput, setPubKeyInput] = useState<string>("")
  const [warning, setWarning] = useState<boolean>(false)
  const new_friend_id = useSelector((state: RootState) => state.friends.max_id)
  const window = useWindowDimensions();

  
  const handleAdd = () => {

    if(nameInput == "" || pubKeyInput == "") {
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
      setNameInput("")
      setPubKeyInput("")
      setInputShown(false)
    }
    else {
      let newFriend: Friend = {id: new_friend_id, nickname: nameInput, pubKey: pubKeyInput};
      dispatch(addFriend(newFriend))
      navigation.goBack();
    }
    
  };

  let scannerProps : CamProps = {
    camStyle: styles.qr_view,
    myFunction: (arg) => {setPubKeyInput(arg)},
  }

  return (
    <SafeAreaView style={styles.container} >
     
      <Text
          style={
              {
                display: warning == false ? "none" : "flex",
                color: "red",
              }
            }>
            Please fill every input
      </Text>

      <View>
        <Input 
          placeholder='FriendName'
          value={nameInput}
          onChangeText={(text) => setNameInput(text)}
        />
        <Input
          value={pubKeyInput}
          placeholder='pubKey'
          onChangeText={(text) => setPubKeyInput(text)} 
        />
      </View>
  
      <View>
        {/* <View style={styles.camerOverlay}></View> */}
          <View style={styles.cameraDiv}>
            <ScannerScreen props={scannerProps}/>
          </View>
      </View>
      
     
      
      

      <View style={styles.button_container}>
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Input: FC<Props> = (props) => {
    return (
        <View style={styles.viewStyle}>
            <TextInput 
                style={styles.textInput}
                value={props.value}
                placeholderTextColor="#555"
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
            />
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  button_container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#736699",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  camerOverlay: {
    zIndex: 2,
    position:"absolute",
    minWidth: 500,
    minHeight: 20,
    backgroundColor: "white",
    left: 0,
    top: 0,
  },
  cameraDiv: {
    flex: 1,
  },
  qr_view: {
    zIndex: -50,
    flex: 1,
    alignSelf: "center",
  }, 
  viewStyle: {
    borderBottomColor: "#3d5c5c",
    borderBottomWidth: 1,
    backgroundColor: "#c2d6d6",
  },
  textInput: {
    marginLeft: 10,
    color: "black",
  },
  friendItem: {
    borderBottomColor: "#3d5c5c",
    borderBottomWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textStyle: {
    textAlign: "left",
    fontSize: 30,
    marginLeft: 10,
    color: "#101"
  },
});


export default AddFriendScreen;
