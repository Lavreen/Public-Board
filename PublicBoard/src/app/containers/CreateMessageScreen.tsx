import React, { useState, FC } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { Text, Surface, TextInput, Button, Provider as PaperProvider, Title } from 'react-native-paper';

import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, Message, sendMessage } from '../redux/MessagesReducer';
import { constKeys } from '../assets/Keys';
import { theme } from '../assets/paperTheme';

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
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
                <Button mode="contained"
                    onPress={() => {
                        setSelectedPublicKey(constKeys.keyA.public)
                        setSelectedKeyName("KeyA")
                        console.log("KeyA")
                    }}
                    color = {selectedKeyName=="KeyA" ? "#AA3939" : ""}>
                KeyA</Button>
                <Button mode="contained"
                    onPress={() => {
                        setSelectedPublicKey(constKeys.keyB.public)
                        setSelectedKeyName("KeyB")
                        console.log("KeyB")
                    }}
                    color = {selectedKeyName=="KeyB" ? "#AA3939" : ""}>
                KeyB</Button>
                <Button mode="contained"
                    onPress={() => {
                        setSelectedPublicKey(constKeys.keyC.public)
                        setSelectedKeyName("KeyC")
                        console.log("KeyC")
                    }}
                    color = {selectedKeyName=="KeyC" ? "#AA3939" : ""}>
                KeyC</Button>
                <Button mode="contained"
                    onPress={() => {
                        setSelectedPublicKey(constKeys.keyD.public)
                        setSelectedKeyName("KeyD")
                        console.log("KeyD")
                    }}
                    color = {selectedKeyName=="KeyD" ? "#AA3939" : ""}>
                KeyD</Button>

                <View style={styles.createMessage}>
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
                    
                    {/* <TouchableOpacity
                    style={styles.sendButton} onPress={submitMessage} >
                        <Text>{">"}</Text>
                    </TouchableOpacity> */}
                    <Button mode="contained"
                        onPress={submitMessage}
                        >
                        Send message
                    </Button>
                </View>
            </SafeAreaView>
        </PaperProvider>
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
    createMessage: {
        display: "flex",
        flexDirection: "column",
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