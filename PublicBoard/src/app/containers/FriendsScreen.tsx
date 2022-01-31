import React, { FC, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { deleteFriends, Friend } from "../redux/FriendsReducer"
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { List, IconButton, Searchbar } from 'react-native-paper';

export type FriendsNavigationParams = {
  obj: {
    details: boolean,
    friend: Friend
  };
};

const FriendsScreen: FC = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const friends = useSelector((state: RootState) => state.friends.Friends)
  const [searchInput, setsearchInput] = useState<string>("")
  const [selectionMode, setSelectionMode] = useState<boolean>()
  const [selectedFriends, setSelectedFriends] = useState<Array<number>>([])

  function manageSelected(id: number): boolean {

    let idx = selectedFriends.indexOf(id)

    if(idx == -1){
      selectedFriends.push(id)
      setSelectionMode(true)
      return true
    } else {
      selectedFriends.splice(idx, 1)
      if(selectedFriends.length == 0)
        setSelectionMode(false)
      
      return false
    }
  }
  return (
    <SafeAreaView style={styles.container} >

      <Searchbar
        value={searchInput}
        placeholderTextColor="#555"
        placeholder={"Search"}
        onChangeText={setsearchInput}
        style={{ height: 40, marginTop: 20, marginHorizontal: 5 }}
      />

      <IconButton
        icon="delete" size={35}
        style={{ marginRight: 0, marginLeft: "auto", display: selectionMode == true ? "flex" : "none" }}
        onPress={() => {
          setSelectionMode(false);
          dispatch(deleteFriends(selectedFriends));
        }}
      />

      <FlatList
        data={friends}
        renderItem={({ item }) => {
          if (item.nickname.startsWith(searchInput)) {
            return (
              <FriendItem
                friend={{ id: item.id, nickname: item.nickname, pubKey: item.pubKey }}
                selectFriend={manageSelected}
                navigation={navigation}
              />
            )
          } else {
            return null
          }
        }
        }
      />


      <IconButton
        icon="plus" size={30}
        style={
          [
            styles.roundButton,
            {
              position: "relative", marginRight: 20, marginBottom: 20,
              marginLeft: "auto", marginTop: "auto"
            }
          ]
        }
        onPress={() => navigation.navigate("AddFriend" as never, {details: false, friend: null} as never)}
      />

    </SafeAreaView>
  );
};



function getRandomColor(arg: String) {

  let valueToAdd = 0;
  for (let i = 0; i < arg.length; i++) {
    valueToAdd += arg.charCodeAt(i);
  }

  return 'rgba(' + String((240 + valueToAdd) % 256) + ','
    + String((230 + valueToAdd) % 256) + ','
    + String((140 + valueToAdd) % 256) + ',' + '0.6' + ')';
}

const IconWithName: FC<{ 
  friendId: number
  nickname: String,
  isSelected: boolean,
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>
  selectFriend: (id: number) => boolean 
}> = (props) => {

  return (
    <TouchableOpacity
      style={[
        styles.roundButton, 
        { 
          backgroundColor: props.isSelected == false 
            ? getRandomColor(props.nickname) : "rgb(54,35,113)"
        }
      ]}
      onPress={ () => {props.setIsSelected(props.selectFriend(props.friendId))} }
    >
    {props.isSelected == false ?
      <RNText style={{ fontSize: 30, color: "white" }}>{props.nickname.charAt(0)}</RNText>
      : <IconButton icon="check" size={30} color="white"/>}
    </TouchableOpacity>
  )
}


const FriendItem: FC<{ 
  friend: Friend, 
  selectFriend: (id: number) => boolean 
  navigation: any
}> = (props) => {

  const [isSelected, setIsSelected] = useState<boolean>(false)

  return (
    <View style={{
      paddingHorizontal:5, 
      paddingVertical:2,
    }}>
    <List.Item
      title={props.friend.nickname}
      onPress={() => {props.navigation.navigate("AddFriend", {details: true, friend: props.friend}) }}
      description={props.friend.pubKey}
      onLongPress={() => {
        setIsSelected(props.selectFriend(props.friend.id))
      }
      }
      left={() =>
        <IconWithName 
          friendId={props.friend.id}
          nickname={props.friend.nickname.concat(props.friend.pubKey.charAt(0))} 
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          selectFriend={props.selectFriend}
        />
      }
      style={{
        backgroundColor: isSelected==false ? "white" : "rgb(154, 154, 156)", 
        borderRadius: 10,
        borderBottomColor: "gray",
        borderBottomWidth: 0.2
      }}
    />
    </View>
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
    height: 60,
    fontWeight: "bold",
    backgroundColor: '#fff',
    borderRadius: 100,
  }
});

export default FriendsScreen;