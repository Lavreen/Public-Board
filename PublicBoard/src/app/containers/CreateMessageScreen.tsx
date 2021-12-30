import React, { useState, FC } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, Message, sendMessage } from '../redux/MessagesReducer';
import { constKeys } from '../assets/Keys';

const CreateMessageScreen: FC = () => {
    const [messageText, setMessageText] = useState<string>("")
    const messages = useSelector((state: RootState) => state.message.messages);
    const [selectedKeyName, setSelectedKeyName] = useState<string>("KeyA");
    const [selectedPublicKey, setSelectedPublicKey] = useState<string>(constKeys.keyA.public);
    const dispatch = useDispatch();
    const submitMessage = () => {
        let publicDestKey = selectedPublicKey
        // console.log(publicDestKey)
        dispatch(sendMessage({ text: messageText, destKey: publicDestKey}));
    }

    return (
        <SafeAreaView style={styles.container}>
            <Button
                onPress={() => {
                    setSelectedPublicKey(constKeys.keyA.public)
                    setSelectedKeyName("KeyA")
                    console.log("KeyA")
                }}
                title="KeyA"
                color = {selectedKeyName=="KeyA" ? "#AA3939" : ""}
            />
            <Button
                onPress={() => {
                    setSelectedPublicKey(constKeys.keyB.public)
                    setSelectedKeyName("KeyB")
                    console.log("KeyB")
                }}
                title="KeyB"
                color = {selectedKeyName=="KeyB" ? "#AA3939" : ""}
            />
            <Button
                onPress={() => {
                    setSelectedPublicKey(constKeys.keyC.public)
                    setSelectedKeyName("KeyC")
                    console.log("KeyC")
                }}
                title="KeyC"
                color = {selectedKeyName=="KeyC" ? "#AA3939" : ""}
            />
            <Button
                onPress={() => {
                    setSelectedPublicKey(constKeys.keyD.public)
                    setSelectedKeyName("KeyD")
                    console.log("KeyD")
                }}
                title="KeyD"
                color = {selectedKeyName=="KeyD" ? "#AA3939" : ""}
            />
            <View style={styles.creteMessage}>
                <View style={styles.viewStyle}>
                    <TextInput
                        style={styles.textInput}
                        value={messageText}
                        placeholderTextColor="#555"
                        onChangeText={setMessageText}
                    />
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={submitMessage} >
                    <Text>{">"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "column",
    },
    myMessageItem: {
        backgroundColor: "#EEEEEE"
    },
    messageItem: {

    },
    creteMessage: {
        display: "flex",
        flexDirection: "row",
    },
    sendButton: {
        alignSelf: "center",
        backgroundColor: "#736699",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginVertical: 10,
    },
    viewStyle: {
        borderBottomColor: "#3d5c5c",
        borderBottomWidth: 1,
        backgroundColor: "#e6e6e5",
        borderRadius: 30,
        width: "90%",
    },
    textInput: {
        marginLeft: 10,
        color: "black",
    },

});   
export default CreateMessageScreen