import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../containers/HomeScreen'
import MessagesScreen from '../containers/MessagesScreen'
import ConversationsScreen from '../containers/ConversationsScreen'
import FriendsScreen from '../containers/FriendsScreen'
import AddFriendScreen from '../containers/AddFriendScreen'
import BoardScreen from '../containers/BoardScreen'
import ProfileScreen from '../containers/ProfileScreen'
import OptionsScreen from '../containers/OptionsScreen'
import ExportScreen from '../containers/ExportScreen'

const Stack = createStackNavigator();

export default function MainNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Messages" component={MessagesScreen} />
			<Stack.Screen name="Conversations" component={ConversationsScreen} />
			<Stack.Screen name="Friends" component={FriendsScreen} />
			<Stack.Screen name="AddFriend" component={AddFriendScreen} />
			<Stack.Screen name="Board" component={BoardScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="Options" component={OptionsScreen} />
			<Stack.Screen name="Export" component={ExportScreen} />
		</Stack.Navigator>
	);
}