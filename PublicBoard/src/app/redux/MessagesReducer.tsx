import { createAction, createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit';
import { getMessageGtId, postMessage } from '../utils/Api';
import { generateEncryptedMessage, decryptMessage } from '../utils/Crypto';
import { RootState } from '../redux/Store';
import LocalStorage from '../utils/LocalStoreage';
import { Friend } from './FriendsReducer';

export type Message = {
    id: number,
    data: string | null,
    timestamp: string | null
    dest: string | null,
    source: string | null
    message: string | null
}

export type MessagesState = {
    messages: Array<Message>,
    currentDest: string,
    id: number,
    fetchActive: boolean,
    sendActive: boolean
}

const initialState: MessagesState = {
    messages: [],
    currentDest: "",
    id: 0,
    fetchActive: false,
    sendActive: false
}

export const resetMessages = createAction<void>('resetMessages')
export const setFetchState = createAction<boolean>('setFetchState')
export const setSendState = createAction<boolean>('setSendState')

export const loadStoredMessages = createAsyncThunk<
    Array<Message>,
    string,
    { state: RootState }
>(
    'messages/loadStoredMessages',
    async (dest, thunkApi) => {
        let messages: Array<Message> = []
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key)
            messages = await database.getMessages(dest);
        }
        return messages
    }
);

export const sendMessage = createAsyncThunk<
    number,
    { text: string, dest: string, destKeys: Array<string> },
    { state: RootState }
>(
    'messages/sendMessage',
    async (message: { text: string, dest: string, destKeys: Array<string> }, thunkApi) => {
        thunkApi.dispatch(setSendState(true))
        await thunkApi.dispatch(fetchMessages())

        const keys = thunkApi.getState().security.rsa;
        let id = -1;

        let database_key = thunkApi.getState().security.database
        if (database_key != null && keys != null) {
            let senddest = message.dest;
            if (senddest != "board")
                senddest = keys.public

            for (let destKey of message.destKeys) {
                let encryptedMessage = await generateEncryptedMessage(destKey, keys, message.text, senddest);
                id = await postMessage(encryptedMessage);
            }
            if (id != -1) {
                let database = await LocalStorage.getStorage(database_key)
                await database.saveMessage(id, "", message.dest, "self", message.text)
            }
        }
        thunkApi.dispatch(setSendState(false))
        return id;
    }
);


export const deleteMsgsForFriend = createAsyncThunk<
void,
Array<number>,
{ state: RootState }
>(
    'messages/deleteMsgsForFriend',
    async (friendsPubKeys, thunkApi) => {
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            await database.deleteMsgsForFriend(friendsPubKeys)
        }
    }
);



export const fetchMessages = createAsyncThunk<
    { messages: Array<Message>, maxid: number },
    string | void,
    { state: RootState }
>(
    'messages/fetchMessages',
    async (arg, thunkApi) => {
        thunkApi.dispatch(setFetchState(true))
        let messages: Array<Message> = [];

        let maxid = 0;

        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key)
            let id = thunkApi.getState().message.id + 1
            console.log(`Fething messages from ${id}`)
            const data = await getMessageGtId(id.toString());
            console.log(`Fetched ${data.length} messages`)
            let private_key
            if (arg)
                private_key = arg
            else
                private_key = thunkApi.getState().security.rsa?.private

            if (private_key != null) {
                let friends = thunkApi.getState().friends.Friends;
                for (let item of data) {
                    if (item.id > maxid)
                        maxid = item.id

                    let decryptedMsg = await decryptMessage(item, private_key)

                    if (decryptedMsg != null && decryptedMsg.message != null && decryptedMsg.dest != null) {
                        let source = decryptedMsg.source
                        if (source == null) source = "unknown"
                        //todo validate message (check if signed correctly)
                        //if not set source to unknown
                        await database.saveMessage(decryptedMsg.id, "", decryptedMsg.dest, source, decryptedMsg.message)
                        for (let friend of friends) {
                            if (friend.pubKey == decryptedMsg.source) {
                                decryptedMsg.source = friend.nickname
                                break;
                            }
                        }
                        messages.push(decryptedMsg)
                    } else {
                        messages.push(item)
                    }
                }

            }
        }
        thunkApi.dispatch(setFetchState(false))
        return { messages: messages, maxid: maxid };
    }
);

export const MessageStoreSlice = createSlice({
    name: "messages",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.fulfilled, (state, action) => {
                action.payload.messages.forEach((message) => {
                    if(message.dest == state.currentDest)
                        state.messages.push(message)
                    else if(state.currentDest == 'board' && message.dest == null)
                        state.messages.push(message)
                    if (+message.id > state.id)
                        state.id = (+message.id)
                });
                // if (action.payload.maxid > state.id)
                //     state.id = action.payload.maxid;

            })
            .addCase(deleteMsgsForFriend.fulfilled, (state, action) => {
                // state.boardMessages = state.boardMessages.filter((msg) => {
                //     action.meta.arg.some((id) => { msg.id == id })
                // })
            })
            .addCase(loadStoredMessages.pending, (state, action) => {
                // state.messages = []
                // state.currentDest = action.meta.arg??'board'
            })
            .addCase(loadStoredMessages.fulfilled, (state, action) => {
                state.messages = []
                state.currentDest = action.meta.arg??'board'
                
                action.payload.forEach((message) => {
                    if(message.dest == state.currentDest)
                        state.messages.push(message)
                    if (+message.id > state.id)
                        state.id = (+message.id)
                });
                console.log(`Loaded ${action.payload.length} messeges. Max id ${state.id}`)
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                console.log("fullfiled ", action.payload)
                if (action.payload != -1) {
                    if (action.meta.arg.dest == state.currentDest){
                        state.messages.push({
                            id: action.payload,
                            data: null,
                            message: action.meta.arg.text,
                            timestamp: null,
                            dest: action.meta.arg.dest,
                            source: 'You'
                        })
                    }
                    if(state.id < action.payload)
                        
                    state.id = action.payload
                }
            })
            .addCase(resetMessages, (state, action) => {
                state.id = 0;
                state.fetchActive = false;
                state.sendActive = false;
            })
            .addCase(setFetchState, (state, action) => {
                state.fetchActive = action.payload;
            })
            .addCase(setSendState, (state, action) => {
                state.sendActive = action.payload;
            })

    }
});

export default MessageStoreSlice.reducer;