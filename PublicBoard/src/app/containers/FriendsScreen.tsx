import React, { FC, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Friend } from "../redux/FriendsReducer"
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Button, TextInput} from 'react-native-paper';

interface Props {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
}

const FriendsScreen: FC = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.friends.Friends)
  const [searchInput, setsearchInput] = useState<string>("")

  /*
  .sort((a: Friend, b: Friend) => {
    return a.nickname > b.nickname ? 1 : b.nickname > a.nickname ? -1 : 0;
  });
  */


  return (
    <SafeAreaView style={styles.container} >
      <TextInput
        value={searchInput}
        placeholderTextColor="#555"
        placeholder={"Search"}
        onChangeText={setsearchInput}
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



const FriendItem: FC<Friend> = (props) => {
  return (
    <View style={styles.friendItem}>
      <View style={
        {
          width: 30,
          height: 30,
        }
      } />
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
});

export default FriendsScreen;
