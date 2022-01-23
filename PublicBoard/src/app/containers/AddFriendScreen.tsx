import React, {FC, useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useWindowDimensions } from 'react-native';
import {addFriend, Friend} from "../redux/FriendsReducer"
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { Text, TextInput, Surface, Button, DefaultTheme, Provider as PaperProvider, List, Menu, Title } from 'react-native-paper';

interface Props {
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
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

  return (
    <SafeAreaView style={styles.container} >
     
      <Title
          style={
              {
                display: warning == false ? "none" : "flex",
                color: "red",
              }
            }>
            Please fill every input
      </Title>

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


    
      <View style={styles.square}>  
        <View style={[styles.qr_view, {width: 3*window.width/4, height: 3*window.width/4}]}>

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
  square: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  qr_view: {
    borderColor: "red",
    borderWidth: 10,
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


const Friends: Friend[] =  [
    {
        id: 1,
        nickname: "Adam",
        pubKey: "RSA-key-example-1"
    },
    {
        id: 2,
        nickname: "Wojtek",
        pubKey: "RSA-key-example-2"
    },
    {
        id: 3,
        nickname: "Kuba",
        pubKey: "RSA-key-example-3"
    },
    {
        id: 4,
        nickname: "Michał",
        pubKey: "RSA-key-example-4"
    }
];


export default AddFriendScreen;
