import React, {useState, FC} from 'react';
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
import { Message, sendMessage} from '../redux/MessagesReducer';

const BoardScreen: FC = () => {

    const [messageText, setMessageText] = useState<string>("")
    const messages = useSelector((state: RootState) => state.message.messages);
    const dispatch = useDispatch();
    const submitMessage = ()=>{
        dispatch(sendMessage(messageText))
    }
    return ( 
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages} 
                renderItem={
                ({item}) => (
              <MessageItem {...item} />
            )}>
            </FlatList>
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
    return (
        <View style={styles.messageItem}>
           <Text>{props.message}</Text> 
           <Text>{props.data}</Text> 
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "column",
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