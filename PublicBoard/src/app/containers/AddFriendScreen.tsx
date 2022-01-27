import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';

import {addFriend, Friend} from "../redux/FriendsReducer"
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Button, TextInput } from 'react-native-paper';

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
  setCamera: (arg: boolean) => void
}

const ScannerScreen: FC<{props:CamProps}> = ({props}) =>{

  return (
    <QRCodeScanner cameraStyle={[props.camStyle, {height: "70%"}]}
      onRead={(e) => {props.myFunction(e.data); props.setCamera(false)}}
      flashMode={RNCamera.Constants.FlashMode.off}
      ratio={"4:3"}
      reactivate={true}
    />
  );

}


const AddFriendScreen: FC = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [nameInput, setNameInput] = useState<string>("")
  const [pubKeyInput, setPubKeyInput] = useState<string>("")
  const [warning, setWarning] = useState<boolean>(false)
  const [enableCamera, setEnableCamera] = useState<boolean>(false)

  
  const handleAdd = () => {

    if(nameInput == "" || pubKeyInput == "") {
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
      setNameInput("")
      setPubKeyInput("")
    }
    else {
      let newFriend: Friend = {id: null, nickname: nameInput, pubKey: pubKeyInput};
      dispatch(addFriend(newFriend))
      navigation.goBack();
    }
    
  };

  let scannerProps : CamProps = {
    camStyle: styles.qr_view,
    myFunction: (arg) => {setPubKeyInput(arg)},
    setCamera: (arg) => {setEnableCamera(arg)}
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
  
      <View style={{display: enableCamera == false ? "none" : "flex"}}>
        <View style={styles.camerOverlay}></View>
          {/* <View style={styles.cameraDiv}> */}
            <ScannerScreen props={scannerProps}/>
          {/* </View> */}
      
      </View>

      <View style={{display: enableCamera == true ? "none" : "flex", margin: 10}}>
            <Button mode="contained" onPress={() => setEnableCamera(true)}>
                Show Cam
            </Button>
      </View>
     
      

      <View style={styles.button_container}>
        <Button mode="contained" onPress={handleAdd}>
          Add
        </Button>
      </View>
    </SafeAreaView>
  );
};

const Input: FC<Props> = (props) => {
    return (
      <TextInput 
        value={props.value}
        placeholderTextColor="#555"
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
      />
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
    margin: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  camerOverlay: {
    zIndex: 2,
    position:"absolute",
    width: "100%",
    minHeight: 30,
    backgroundColor: "white",
    left: 0,
    top: 0,
  },
  qr_view: {
    zIndex: -50,
    flex: 1,
    alignSelf: "center",
  }, 
});


export default AddFriendScreen;
