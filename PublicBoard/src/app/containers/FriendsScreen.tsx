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

import { useNavigation } from '@react-navigation/native';
import { Friend } from "../redux/FriendsReducer"
import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';

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
      <Input 
          value={searchInput}
          placeholder='search' 
          onChangeText={(text) => setsearchInput(text)}
      />
  
      <FlatList
          data={friends} 
          renderItem={({item})=>{
              if(item.nickname.startsWith(searchInput)){
                return(<FriendItem id={item.id} nickname={item.nickname} pubKey={item.pubKey} />)
              } else {
                return <View/>
              }
           }
          }
      />
    
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddFriend")}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
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

export default FriendsScreen;
