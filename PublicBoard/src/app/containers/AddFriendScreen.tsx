import React, { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { addFriend, checkPubKey, editFriend } from "../redux/FriendsReducer"
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { unwrapResult } from '@reduxjs/toolkit'
import type { FriendsNavigationParams } from './FriendsScreen'
import QRCode from 'react-native-qrcode-svg';

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
  setKeyFunc: (arg: string) => void
  keyValidator: (arg: string) => boolean
  setCam: (arg:boolean) => void
}

const ScannerScreen: FC<{props:CamProps}> = ({props}) =>{

    return (
      <QRCodeScanner cameraStyle={styles.camStyle}
        onRead={(e) => {
          if(props.keyValidator(e.data)){
            props.setKeyFunc(e.data); 
            props.setCam(false);
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
  const route = useRoute<RouteProp<FriendsNavigationParams, 'obj' >>();
  const dispatch = useDispatch();
  const [nameInput, setNameInput] = 
    useState<string>(route.params.details == true ? route.params.friend.nickname: "")
  const [pubKeyInput, setPubKeyInput] = 
    useState<string>(route.params.details == true ? route.params.friend.pubKey: "")
  const [enableCamera, setEnableCamera] = useState<boolean>(false)
  const [warningText, setWarningText] = useState<string>("")
  const [editMode, setEditMode] = useState<boolean>(route.params.details == true ? false : true)


  const validatePubKey = (pubKey: string) :boolean => {
    let re = /-----BEGIN RSA PUBLIC KEY-----(.*)-----END RSA PUBLIC KEY-----/s;
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
        //return
      }

      if(route.params.details == true && pubKeyInput == route.params.friend.pubKey){
       
        let friendToEdit = {
          id: route.params.friend.id,
          nickname: nameInput,
          pubKey: pubKeyInput,
        }
        dispatch(editFriend(friendToEdit))
        navigation.goBack();
        return   
      }

      await dispatch(checkPubKey(pubKeyInput))
      .then(unwrapResult)
      .then((ifExists: boolean) => {
        if(!ifExists){
          if(route.params.details == true){
            let friendToEdit = {
              id: route.params.friend.id,
              nickname: nameInput,
              pubKey: pubKeyInput,
            }
           
            dispatch(editFriend(friendToEdit))
            navigation.goBack();
          } else {
            dispatch(addFriend({nickname: nameInput, pubKey: pubKeyInput}))
            navigation.goBack();
          } 
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
    setKeyFunc: (arg) => setPubKeyInput(arg),
    keyValidator: (arg: string) => validatePubKey(arg),
    setCam: setEnableCamera,
  }

  return (
    
    <SafeAreaView style={styles.container} >
     
      <View style={styles.topInput}>
        <TextInput 
          placeholder='Friend Name'
          value={nameInput}
          onChangeText={(text) => setNameInput(text)}
          editable={editMode == true ? true : false}
        />
        <TextInput
          value={pubKeyInput}
          placeholder='Public Key'
          onChangeText={(text) => setPubKeyInput(text)} 
          editable={editMode == true ? true : false}
        />
      </View>

      <Text
          style={
              {
                color: "red", fontSize: 15, backgroundColor: "white", 
                alignSelf: "center", marginTop: 3,
              }
            }>
            {warningText}
      </Text>
      

      {route.params.details == true ?
      <IconButton 
        icon="lead-pencil" size={30}
        style={
          {
            alignSelf: "flex-end",
            backgroundColor: "pink"
          }
        }
        onPress={() => {
          setEditMode(!editMode);
          setEnableCamera(editMode);
        }}
      />: null}

      {editMode == true ? 
        <IconButton 
          icon="qrcode" size={300}
          style={
            {
              display: enableCamera == true ? "none" : "flex",
              alignSelf: "center"
            }
          }
          onPress={() => setEnableCamera(true)}
        />
        : route.params.details == true ? 
        <View style={styles.qrGenerated}>
           <QRCode
            size={400}
            value={route.params.friend.pubKey}
          /> 
        </View>
        : null
      }

      {enableCamera == true && editMode == true? <ScannerScreen props={scannerProps}/> : null}

      {route.params.details == true && editMode == false ? 
        null :
        <Button style={styles.addButton} mode="contained" onPress={handleAdd}>
           Save
        </Button>
      }
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  topInput: {
    paddingHorizontal: 10,
    paddingTop: 5
  },
  addButton: {
    marginBottom: 10,
    marginTop: "auto",
    minWidth: "50%",
    alignSelf: "center"
  },
  camStyle: {
    maxWidth: "60%",
    alignSelf: "center"
  },
  qrGenerated: {
    alignSelf: "center"
  }
});


export default AddFriendScreen;
