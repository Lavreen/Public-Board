import React, { FC, useCallback, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { deleteFriends, Friend } from "../redux/FriendsReducer"
import { buttonStyle, FriendItem } from "../containers/FriendItem"
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import {IconButton, Searchbar } from 'react-native-paper';

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
  const [selectedFriends] = useState<Array<number>>([])

  
  const manageSelected = useCallback( 
    (id: number): boolean  => {

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
  }, []
  )  

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
        style={[styles.trashIcon, {display: selectionMode ? "flex" : "none"}]}
        onPress={() => {
          setSelectionMode(false);
          dispatch(deleteFriends(selectedFriends));
        }}
      />
      
      <FlatList
        data={friends}
        renderItem={({ item }) => {
          if (item.nickname.toLocaleLowerCase().startsWith(searchInput.toLocaleLowerCase())) {
            return (
              <FriendItem
                friend={{ id: item.id, nickname: item.nickname, pubKey: item.pubKey }}
                selectFriend={manageSelected}
                navigationFunc={() => {navigation.navigate("AddFriend", {details: true, friend: item})} }
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
            buttonStyle.roundButton,
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
  trashIcon: {
    marginRight: 2,
    marginLeft: "auto",
  },
});

export default FriendsScreen;