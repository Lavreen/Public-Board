import React, { FC, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Friend } from "../redux/FriendsReducer"
import { RootState } from '../redux/Store';
import { useSelector } from 'react-redux';
import { List, Button, TextInput} from 'react-native-paper';


const FriendsScreen: FC = () => {

  const navigation = useNavigation();
  const friends = useSelector((state: RootState) => state.friends.Friends)
  const [searchInput, setsearchInput] = useState<string>("")

  return (
    <SafeAreaView style={styles.container} >

      <TextInput
        value={searchInput}
        placeholderTextColor="#555"
        placeholder={"Search"}
        onChangeText={setsearchInput}
        style={{height: 50}}
      />


      <FlatList
        data={friends}
        renderItem={({ item }) => {
          if (item.nickname.startsWith(searchInput)) {
            return (<FriendItem id={item.id} nickname={item.nickname} pubKey={item.pubKey} />)
          } else {
            return <View />
          }
        }
        }
      />

      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("AddFriend")}>
        Add
      </Button>
    </SafeAreaView>
  );
};



function getRandomColor (arg: String) {

  let valueToAdd = 0;
  for (let i = 0; i < arg.length; i++) {
    valueToAdd += arg.charCodeAt(i);
  }
  
  return 'rgba(' + String((240+valueToAdd)%256) + ',' 
  + String((230+valueToAdd)%256) + ',' 
  + String((140+valueToAdd)%256) + ',' + '0.6' + ')'; 
}

const IconWithName: FC<{nickname: String}> = (props) => {

  return (
    <TouchableOpacity
      style={[styles.roundButton, {backgroundColor: getRandomColor(props.nickname)}]}
    >
    <RNText style={{fontSize: 30, color: "white"}}>{props.nickname.charAt(0)}</RNText>
    </TouchableOpacity>
  )
}


const FriendItem: FC<Friend> = (props) => {

  return (
    <List.Item
    title={props.nickname}
    description={props.pubKey}
    left={() => <IconWithName nickname={
      props.nickname.concat(props.pubKey.charAt(0))
    } ></IconWithName>}
    />
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    margin: 5
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
  roundButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    right: 10,
    left: 3,
    height: 60,
    fontWeight: "bold",
    backgroundColor: '#fff',
    borderRadius: 100,
  }
});

export default FriendsScreen;
