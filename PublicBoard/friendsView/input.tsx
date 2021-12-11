import React, { Children, FC } from "react";
import {View, TextInput, StyleSheet, Text} from "react-native"


interface Props {
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
}

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
    viewStyle: {
      borderBottomColor: "#3d5c5c",
      borderBottomWidth: 1,
      backgroundColor: "#c2d6d6",
    },
    textInput: {
      marginLeft: 10,
      color: "black",
    },
  });

export default Input;
