import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {addFriend, checkPubKey, Friend} from "../redux/FriendsReducer"
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Button, TextInput } from 'react-native-paper';
import { unwrapResult } from '@reduxjs/toolkit'

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

interface CamProps {
  camStyle: any,
  myFunction: (arg: string) => void
  setCamera: (arg: boolean) => void
  validator: (arg: string) => boolean
}

const ScannerScreen: FC<{props:CamProps}> = ({props}) =>{

  return (
    <QRCodeScanner cameraStyle={[props.camStyle, {height: "70%", flex: 0.7}]}
      onRead={(e) => {
        if(props.validator(e.data)){
          props.myFunction(e.data); props.setCamera(false)
        }
      }}
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
  const [enableCamera, setEnableCamera] = useState<boolean>(false)
  const [warningText, setWarningText] = useState<string>("")

  const validatePubKey = (pubKey: string) :boolean=> {
    let re = /-----BEGIN PUBLIC KEY-----(.*)-----END PUBLIC KEY-----/s;
      return re.test(pubKey);
  };

  const handleAdd = async () => {

    if(nameInput == "" || pubKeyInput == "") {
      setWarningText("Please fill every input")
      setTimeout(() => setWarningText(""), 3000);
    }
    else {
      if(!validatePubKey(pubKeyInput)){
        setWarningText("Bad key input")
        setTimeout(() => setWarningText(""), 3000);
        return
      }
      
      await dispatch(checkPubKey(pubKeyInput))
      .then(unwrapResult)
      .then((ifExists: boolean) => {
        if(!ifExists){
          let newFriend: Friend = {id: null, nickname: nameInput, pubKey: pubKeyInput};
          dispatch(addFriend(newFriend))
          navigation.goBack();
        } else {
          setWarningText("This pubKey already exists")
          setTimeout(() => setWarningText(""), 3000);
        }
      })
      .catch((rejectedVal) => {
      })

    }
  };

  let scannerProps : CamProps = {
    camStyle: styles.qr_view,
    myFunction: (arg) => {setPubKeyInput(arg)},
    setCamera: (arg) => {setEnableCamera(arg)},
    validator: (arg: string) => validatePubKey(arg)
  }

  return (
    
    <SafeAreaView style={styles.container} >
     
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

      <Text
          style={
              {
                color: "red", fontSize: 15, backgroundColor: "white"
              }
            }>
            {warningText}
      </Text>
      
      <View style={{display: enableCamera == false ? "none" : "flex"}}>
        <View style={styles.camerOverlay}></View>
            <ScannerScreen props={scannerProps}/>
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
