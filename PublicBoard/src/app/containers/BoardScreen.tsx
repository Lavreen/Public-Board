import React, { useState, FC } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, Message, sendMessage } from '../redux/MessagesReducer';
import { TextInput, Provider as PaperProvider, Appbar, List, ActivityIndicator } from 'react-native-paper';
import { theme } from '../assets/paperTheme';

const BoardScreen: FC = () => {

    const [messageText, setMessageText] = useState<string>("")
    const [showUndecrypted, setShowUndecrypted] = useState<boolean>(false);


    const messages = useSelector((state: RootState) => state.message.boardMessages);
    const friends = useSelector((state: RootState) => state.friends.Friends);
    const loading = useSelector((state: RootState) => state.message.fetchActive);
    const inputLocked = useSelector((state: RootState) => state.message.sendActive);
    const dispatch = useDispatch();

    const submitMessage = () => {
        if(messageText == "") return;
        let keys: Array<string> = []
        friends.forEach((friend)=>{
            keys.push(friend.pubKey)
        });
        if(keys.length > 0){
            //todo set dispatch type to avoid then error
            dispatch(sendMessage({ text: messageText, destKeys: keys, dest: 'board'})).then(()=>{
                setMessageText("");
            });
        }
    }

    const _render_item = (message: Message) => {
        if (message.message == null) {
            if (showUndecrypted) {
                return (
                    <List.Item
                        title={"Couldn't decrypt"}
                        titleStyle={textStylesheet.undecrypted}
                        descriptionNumberOfLines={1}
                        description={message.data}
                        
                    />
                );
            } else
                return null;
        } else {
            if(message.self){
                return (
                    <List.Item
                        title={message.source}
                        titleStyle={textStylesheet.user}
                        descriptionNumberOfLines={10}
                        description={message.message}
                    />
                );
            } else{
                return (
                    <List.Item
                        title={message.source}
                        descriptionNumberOfLines={10}
                        description={message.message}
                    />
                );
            }
        }
    }

    return (
        <PaperProvider theme={theme}>
            <Appbar.Header>
                <Appbar.Content
                    title="Public Board"
                    subtitle={showUndecrypted ? "All messages" : "Only decrypted messages"}
                />
                <Appbar.Action
                    icon={showUndecrypted ? "book-lock" : "book"}
                    onPress={() => setShowUndecrypted(!showUndecrypted)}
                />
                <Appbar.Action
                    icon="refresh"
                    onPress={() => dispatch(fetchMessages())}
                />
            </Appbar.Header>

            <FlatList
                data={messages}
                inverted={true}
                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                keyExtractor={ (item)=>item.id.toString() }
                renderItem={(item) => _render_item(item.item)}
            />
            <ActivityIndicator animating={loading} hidesWhenStopped={true}/>
            
            <KeyboardAvoidingView>
                <TextInput
                    multiline={true}
                    label="Message content"
                    value={messageText}
                    disabled={inputLocked}
                    placeholderTextColor="#555"
                    onChangeText={setMessageText}
                    right={
                        <TextInput.Icon
                            name="send-lock"
                            onPress={submitMessage}
                        />
                    }
                />
            </KeyboardAvoidingView>
        </PaperProvider>
    );
}

export default BoardScreen

const textStylesheet = StyleSheet.create({
    undecrypted:{
        color: 'red'
    },
    user:{
        color: 'green'
    }
});