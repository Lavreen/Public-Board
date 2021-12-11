import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../containers/LoginScreen'
import HomeScreen from '../containers/HomeScreen'
import MessagesScreen from '../containers/MessagesScreen'
import CreateMessageScreen from '../containers/CreateMessageScreen'
import FriendsScreen from '../containers/FriendsScreen'
import BoardScreen from '../containers/BoardScreen'


const Stack = createStackNavigator();

//TODO define proper navigators with exported types
export default function MainNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Messages" component={MessagesScreen} />
			<Stack.Screen name="CreateMessage" component={CreateMessageScreen} />
			<Stack.Screen name="Friends" component={FriendsScreen} />
			<Stack.Screen name="Board" component={BoardScreen} />
		</Stack.Navigator>
	);
}