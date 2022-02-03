import React, { useState, FC, useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, loadStoredMessages, Message, sendMessage } from '../redux/MessagesReducer';
import { TextInput, Provider as PaperProvider, Appbar, List, ActivityIndicator, Divider } from 'react-native-paper';
import { theme } from '../assets/paperTheme';
import { useRoute } from '@react-navigation/native';


const MessagesScreen: FC = () => {
	const dispatch = useDispatch();
	//todo type...
	const route = useRoute<any>();
	const pubkey = route.params.pubkey
	const nickname = route.params.nickname

	const [messageText, setMessageText] = useState<string>("")
	const [send, setSend] = useState<boolean>(false);

	const messages = useSelector((state: RootState) => state.message.privateConversation);
	const loading = useSelector((state: RootState) => state.message.fetchActive);
	const inputLocked = useSelector((state: RootState) => state.message.sendActive);


	useEffect(() => {
		dispatch(loadStoredMessages(pubkey))
	}, [])

	const submitMessage = () => {
		if (messageText == "") return;

		dispatch(sendMessage({ text: messageText, destKeys: [pubkey], dest: pubkey }))
		setSend(true)
	}

	if (send && !inputLocked) {
		setMessageText("");
		setSend(false);
	}

	const _render_item = (message: Message) => {
		if (message.message == null) {
			return null;
		} else {
			if (message.source == "You") {
				return (
					<View>
						<Divider />
						<List.Item
							title={message.source}
							titleStyle={textStylesheet.userTitle}
							description={message.message}
							descriptionNumberOfLines={20}
							descriptionStyle={textStylesheet.userMessage}
						/>
					</View>
				);
			} else {
				return (
					<View>
						<Divider />
						<List.Item
							title={message.source}
							titleStyle={textStylesheet.title}
							description={message.message}
							descriptionNumberOfLines={20}
							descriptionStyle={textStylesheet.message}
						/>
					</View>
				);
			}
		}
	}

	return (
		<PaperProvider theme={theme}>
			<Appbar.Header>
				<Appbar.Content
					title="Messages"
					subtitle={nickname}
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
				keyExtractor={(item) => item.id.toString()}
				renderItem={(item) => _render_item(item.item)}
			/>
			{loading && <ActivityIndicator animating={loading} hidesWhenStopped={true} />}

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

export default MessagesScreen

const textStylesheet = StyleSheet.create({
	userTitle: {
		color: 'green',
		alignSelf: 'flex-end',
		marginRight: 20
	},
	userMessage: {
		alignSelf: 'flex-end',
		marginRight: 10,
		marginLeft: 50
	},
	title: {
		marginLeft: 20
	},
	message: {
		marginRight: 50,
		marginLeft: 10
	}
});