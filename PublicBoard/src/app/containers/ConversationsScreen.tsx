import React, { FC, useCallback, useState } from 'react';
import { FlatList, } from 'react-native';

import { Appbar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/Store';
import { deleteMsgsForFriend, fetchMessages, LastMessage, lastMessages } from '../redux/MessagesReducer';

import { SafeAreaView } from 'react-native-safe-area-context';
import { FriendItem } from "../containers/FriendItem"



const ConversationsScreen: FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const friends = useSelector((state: RootState) => state.friends.Friends)
    dispatch(lastMessages(friends))
    const lastMsgs =  useSelector((state: RootState) => state.message.lastMsgs)
    const [selectionMode, setSelectionMode] = useState<boolean>()
    const [selectedFriends] = useState<Array<number>>([])
    
    const manageSelected = useCallback( 
        (id: number): boolean  => {

            let idx = selectedFriends.indexOf(id)

            if(idx == -1){
            selectedFriends.push(id)
            setSelectionMode(true)
            return true
            } else {
            selectedFriends.splice(idx, 1)
            if(selectedFriends.length == 0)
                setSelectionMode(false)
            
            return false
        }
        }, []
    )  
    
    return (
        
        <SafeAreaView>
            <Appbar.Header>
                <Appbar.Content
                    title="Conversations"
                />
                <Appbar.Action
                    icon="refresh"
                    onPress={() => dispatch(fetchMessages())}
                />
            </Appbar.Header>
            <IconButton
                icon="delete" size={35}
                style={{
                    marginRight: 2,
                    marginLeft: "auto",
                    display: selectionMode ? "flex" : "none"
                }}
                onPress={() => {
                    setSelectionMode(false);
                    dispatch(deleteMsgsForFriend(selectedFriends));
                }}
            />
            <FlatList
                data={friends}
                renderItem={({ item }) => {
                    return (
                      <FriendItem
                        friend={{ 
                            id: item.id, 
                            nickname: item.nickname, 
                            pubKey: lastMsgs[friends.indexOf(item)]?.message || ""
                        }}
                        selectFriend={manageSelected}
                        navigationFunc={() => {navigation.navigate(
                            'Messages' as never,
                            { nickname: item.nickname, pubkey: item.pubKey } as never
                        )} }
                      />
                    )
                  }
                }
            />
        </SafeAreaView>
    );
}
export default ConversationsScreen