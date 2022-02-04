import React, { FC, useState } from "react";
import { TouchableOpacity, Text as RNText, View, StyleSheet} from "react-native";
import { IconButton, List } from "react-native-paper";
import { Friend } from "../redux/FriendsReducer";

export const FriendItem: FC<{ 
  friend: Friend, 
  selectFriend: (id: number) => boolean 
  navigationFunc: () => void
}> = (props) => {

  const [isSelected, setIsSelected] = useState<boolean>(false)

  return (
    <View style={{
      paddingHorizontal:5, 
      paddingVertical:2,
    }}>
    <List.Item
      title={props.friend.nickname}
      onPress={props.navigationFunc}
      description={props.friend.pubKey}
      onLongPress={() => {
          setIsSelected(props.selectFriend(props.friend.id))
        }
      }
      left={() =>
        <IconWithName 
          friendId={props.friend.id}
          nickname={props.friend.nickname.concat(props.friend.pubKey.charAt(0).toLocaleUpperCase())} 
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

const IconWithName: FC<{ 
  friendId: number
  nickname: String,
  isSelected: boolean,
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>
  selectFriend: (id: number) => boolean 
}> = (props) => {
  
  const myFunc = function() : void {
    props.setIsSelected(props.selectFriend(props.friendId))
  }

  return (
    <TouchableOpacity
      style={[
        buttonStyle.roundButton, 
        { 
          backgroundColor: props.isSelected == false 
            ? getRandomColor(props.nickname) : "rgb(54,35,113)"
        }
      ]}
      onPress={myFunc}
    >
    {props.isSelected == false ?
      <RNText style={{ fontSize: 30, color: "white" }}>{props.nickname.charAt(0).toLocaleUpperCase()}</RNText>
      : <IconButton icon="check" size={30} color="white"/>}
    </TouchableOpacity>
  )
}

function getRandomColor(arg: String) {

  let valueToAdd = 0;
  for (let i = 0; i < arg.length; i++) {
    valueToAdd += arg.charCodeAt(i);
  }

  return 'rgba(' + String((240 + valueToAdd) % 256) + ','
    + String((230 + valueToAdd) % 256) + ','
    + String((140 + valueToAdd) % 256) + ',' + '0.6' + ')';
}

export const buttonStyle = StyleSheet.create({
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