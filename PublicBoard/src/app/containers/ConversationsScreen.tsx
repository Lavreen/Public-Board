import React, { FC } from 'react';
import { View, FlatList, } from 'react-native';

import { List, Avatar, Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/Store';
import { fetchMessages } from '../redux/MessagesReducer';
import { Friend } from '../redux/FriendsReducer';

const ConversationsScreen: FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const friends = useSelector((state: RootState) => state.friends.Friends)
    const _render_item = (friend: Friend) => {
        return (
            <List.Item
                title={friend.nickname}
                description={"todo last message"}
                left={() =>
                    <Avatar.Text size={60} label={friend.nickname[0]} />
                }
                onPress={() => navigation.navigate(
                    'Messages' as never,
                    { nickname: friend.nickname, pubkey: friend.pubKey } as never
                )}
            />
        );
    }
    return (
        <View>
            <Appbar.Header>
                <Appbar.Content
                    title="Conversations"
                />
                <Appbar.Action
                    icon="refresh"
                    onPress={() => dispatch(fetchMessages())}
                />
            </Appbar.Header>
            <FlatList
                data={friends}
                renderItem={({ item }) => _render_item(item)}
            />
        </View>
    );
}
export default ConversationsScreen