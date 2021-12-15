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
import { fetchMessages, Message, sendMessage } from '../redux/MessagesReducer';

const BoardScreen: FC = () => {

    const [messageText, setMessageText] = useState<string>("")
    const messages = useSelector((state: RootState) => state.message.messages);
    const dispatch = useDispatch();
    const submitMessage = () => {
        dispatch(sendMessage({ text: messageText, to: 'SELF' }));
    }
    return (
        <SafeAreaView style={styles.container}>
            <Button title='fetch messages' onPress={() => dispatch(fetchMessages())}></Button>
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
                <Text>{props.message}</Text>
                <Text>{props.data}</Text>
            </View>
        );
    else
        return (
            <View style={styles.messageItem}>
                <Text>{props.message}</Text>
                <Text>{props.data}</Text>
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

export default BoardScreen