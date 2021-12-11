import React, {FC, useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Friend, Friends} from "./data";
import Input from './input';
import FriendItem from './itemView';

const FriendsViewComponent: FC = () => {

  const [friends, setFriends] = useState<Friend[] | null> (null)
  const [inputShown, setInputShown] = useState<boolean>(false)
  const [searchInput, setsearchInput] = useState<string>("")
  const [nameInput, setNameInput] = useState<string>("")
  const [pubKeyInput, setPubKeyInput] = useState<string>("")
  const [warning, setWarning] = useState<boolean>(false)

  useEffect(() => {
    (() => {
      setFriends(
        Friends.sort((a: Friend, b: Friend) => {
          return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        })
      );
    })()
  }, []);

  const handleSearch = (text: string) => {
    setsearchInput(text)
    const friends: Friend[] = Friends.filter(friend => 
      friend.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    );
    setFriends(friends);
  };

  const handleAdd = () => {

    if(nameInput == "" || pubKeyInput == "") {
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
    }
    else {
      if(friends === null){
        let newFriend: Friend = {id: 1, name: nameInput, pub_key: pubKeyInput};
        setFriends([newFriend]);
      } else {
        let newFriend: Friend = {id: friends.length+1, name: nameInput, pub_key: pubKeyInput};
        setFriends([...friends, newFriend]);
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
              <FriendItem id={item.id} name={item.name} pub_key={item.pub_key} />
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
  warning: {
    
  },
});

export default FriendsViewComponent;
