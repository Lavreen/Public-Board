import React, { useState, FC, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, Message, resetMessages, sendMessage } from '../redux/MessagesReducer';
import { Text, TextInput, Surface, Button, DefaultTheme, Provider as PaperProvider, List, Menu, Title } from 'react-native-paper';

import { constKeys } from '../assets/Keys';
import { theme } from '../assets/paperTheme';

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
        <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
            <Button mode="contained"
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyA.private)
                    setSelectedKeyName("KeyA")
                    dispatch(resetMessages())
                    console.log("KeyA")
                }}
                color = {selectedKeyName=="KeyA" ? "#AA3939" : ""}>
                KeyA
                
            </Button>
            <Button mode="contained"
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyB.private)
                    setSelectedKeyName("KeyB")
                    dispatch(resetMessages())
                    console.log("KeyB")
                }}
                color = {selectedKeyName=="KeyB" ? "#AA3939" : ""}>
                    KeyB
                </Button>
            <Button mode="contained"
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyC.private)
                    setSelectedKeyName("KeyC")
                    dispatch(resetMessages())
                    console.log("KeyC")
                }}
                color = {selectedKeyName=="KeyC" ? "#AA3939" : ""}>
                    KeyC
                </Button>
            <Button mode="contained"
                onPress={() => {
                    setSelectedPrivateKey(constKeys.keyD.private)
                    setSelectedKeyName("KeyD")
                    dispatch(resetMessages())
                    console.log("KeyD")
                }}
                color = {selectedKeyName=="KeyD" ? "#AA3939" : ""}>
                KeyD
                </Button>
            <Button mode="contained" onPress={() => dispatch(fetchMessages(selectedPrivateKey))}>
                fetch Messeges
            </Button>
            
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
                        multiline={true}
                        label="Message content"
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
        </PaperProvider>
    );
}

const MessageItem: FC<Message> = (props) => {
    let data = props.data?.slice(0,90)
    if(props.data!=null && props.data.length > 90)
        data += '...'

    if (typeof props.id === 'string' && props.id.startsWith('SELF-'))
        return (
            <View style={styles.myMessageItem}>
                <Text style={styles.greenText}>{props.message}</Text>
                <Text style={styles.redText}>{data}</Text>
            </View>
        );
    else
        return (
            <View style={styles.messageItem}>
                <Text style={styles.greenText}>{props.message}</Text>
                <Text style={styles.redText}>{data}</Text>
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