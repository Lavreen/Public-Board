import React, {FC, useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import {addFriend, Friend} from "../redux/FriendsReducer"
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
}

const FriendsScreen: FC = () => {

  //const [friends, setFriends] = useState<Friend[] | null> (null)
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.friends.Friends);
  const [inputShown, setInputShown] = useState<boolean>(false)
  const [searchInput, setsearchInput] = useState<string>("")
  const [nameInput, setNameInput] = useState<string>("")
  const [pubKeyInput, setPubKeyInput] = useState<string>("")
  const [warning, setWarning] = useState<boolean>(false)

  
  useEffect(() => {
    (() => {
        /*
        setFriends(
          Friends.sort((a: Friend, b: Friend) => {
          return a.nickname > b.nickname ? 1 : b.nickname > a.nickname ? -1 : 0;
        })
        );
        */
    })()
  }, []);
  

  const handleSearch = (text: string) => {
    setsearchInput(text)
    const friends: Friend[] = Friends.filter(friend => 
        friend.nickname.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    );
    //setFriends(friends);
  };

  const handleAdd = () => {

    if(nameInput == "" || pubKeyInput == "") {
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
    }
    else {
      if(friends === null){
        let newFriend: Friend = {id: 1, nickname: nameInput, pubKey: pubKeyInput};
        dispatch(addFriend(newFriend))
        //setFriends([newFriend]);
      } else {
        let newFriend: Friend = {id: friends.length+1, nickname: nameInput, pubKey: pubKeyInput};
        dispatch(addFriend(newFriend))
        //setFriends([...friends, newFriend]);
      }
      setNameInput("")
      setPubKeyInput("")
      setInputShown(false)
    }
  };

  return (
    <SafeAreaView style={styles.container} >
      <Input 
          value={searchInput}
          placeholder='search' 
          onChangeText={(text) => handleSearch(text)}
      />
      <FlatList
          data={friends} 
          renderItem={
            ({item}) => (
              <FriendItem id={item.id} nickname={item.nickname} pubKey={item.pubKey} />
            )}
      />
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
        <TouchableOpacity 
          style={
            [
              styles.button,
              {display: inputShown == false ? "flex" : "none"}
            ]
          }
          onPress={() => setInputShown(true)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={ {display: inputShown == true ? "flex" : "none"} }>
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

const FriendItem: FC<Friend> = (props) => {
    return (
        <View style={styles.friendItem}>
            <View style={
            {
                width: 30,
                height: 30,
            }
            }/>
            <Text style={styles.textStyle}>
                {props.pubKey}
            </Text>
            <Text style={[styles.textStyle, {
                marginRight: 10,
            }]}>
                {props.nickname}
            </Text>
        </View> 
    )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#736699",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
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


export default FriendsScreen;
