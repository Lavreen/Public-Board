import {Friend} from "./data"
import React, {FC} from 'react'
import {View, Text, StyleSheet} from 'react-native'

const FriendItem: FC<Friend> = (props) => {
    return (
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>
            {props.name}
          </Text>
        </View> 
    )
}

const styles = StyleSheet.create({
  viewStyle: {
    borderBottomColor: "#3d5c5c",
    borderBottomWidth: 2,
  },
  textStyle: {
    textAlign: "left",
    fontSize: 30,
    marginLeft: 10,
    color: "#101"
  },
});

export default FriendItem