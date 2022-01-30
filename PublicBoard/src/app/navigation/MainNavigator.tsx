import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../containers/HomeScreen'
import MessagesScreen from '../containers/MessagesScreen'
import CreateMessageScreen from '../containers/CreateMessageScreen'
import FriendsScreen from '../containers/FriendsScreen'
import AddFriendScreen from '../containers/AddFriendScreen'
import BoardScreen from '../containers/BoardScreen'
import ProfileScreen from '../containers/ProfileScreen'


const Stack = createStackNavigator();

//TODO define proper navigators with exported types
export default function MainNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Messages" component={MessagesScreen} />
			<Stack.Screen name="CreateMessage" component={CreateMessageScreen} />
			<Stack.Screen name="Friends" component={FriendsScreen} />
			<Stack.Screen name="AddFriend" component={AddFriendScreen} />
			<Stack.Screen name="Board" component={BoardScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
		</Stack.Navigator>
	);
}