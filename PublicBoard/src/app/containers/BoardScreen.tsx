import React, { useState, FC, useEffect } from 'react';
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
import { fetchMessages, Message, resetMessages, sendMessage } from '../redux/MessagesReducer';

import { constKeys } from '../assets/Keys';

const BoardScreen: FC = () => {

    const [messageText, setMessageText] = useState<string>("")
    const messages = useSelector((state: RootState) => state.message.messages);
    const [selectedPrivateKey, setSelectedPrivateKey] = useState<string>(constKeys.keyA.private);
    const [selectedKeyName, setSelectedKeyName] = useState<string>("KeyA");

    const dispatch = useDispatch();
    const submitMessage = () => {
        dispatch(sendMessage({ text: messageText, destKey: constKeys.keyA.private }));
    }
    return (
        <SafeAreaView style={styles.container}>
            <Button
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyA.private)
                    setSelectedKeyName("KeyA")
                    dispatch(resetMessages())
                    console.log("KeyA")
                }}
                title="KeyA"
                color = {selectedKeyName=="KeyA" ? "#AA3939" : ""}
            />
            <Button
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyB.private)
                    setSelectedKeyName("KeyB")
                    dispatch(resetMessages())
                    console.log("KeyB")
                }}
                title="KeyB"
                color = {selectedKeyName=="KeyB" ? "#AA3939" : ""}
            />
            <Button
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyC.private)
                    setSelectedKeyName("KeyC")
                    dispatch(resetMessages())
                    console.log("KeyC")
                }}
                title="KeyC"
                color = {selectedKeyName=="KeyC" ? "#AA3939" : ""}
            />
            <Button
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyD.private)
                    setSelectedKeyName("KeyD")
                    dispatch(resetMessages())
                    console.log("KeyD")
                }}
                title="KeyD"
                color = {selectedKeyName=="KeyD" ? "#AA3939" : ""}
            />
            <Button title='fetch messages' onPress={() => dispatch(fetchMessages(selectedPrivateKey))}></Button>
            <FlatList
                data={messages}
                //temporary cause weird looking animation change to scroll list?
                inverted={true}
                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                renderItem={({ item }) => (<MessageItem {...item} />)}
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

const MessageItem: FC<Message> = (props) => {
    if (typeof props.id === 'string' && props.id.startsWith('SELF-'))
        return (
            <View style={styles.myMessageItem}>
                <Text style={styles.greenText}>{props.message}</Text>
                <Text style={styles.redText}>{props.data}</Text>
            </View>
        );
    else
        return (
            <View style={styles.messageItem}>
                <Text style={styles.greenText}>{props.message}</Text>
                <Text style={styles.redText}>{props.data}</Text>
            </View>
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
        borderBottomColor: "#000000",
        borderBottomWidth: 2,
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
    redText: {
        color: "red",
    },
    greenText: {
        color: "green",
    },

});

export default BoardScreen