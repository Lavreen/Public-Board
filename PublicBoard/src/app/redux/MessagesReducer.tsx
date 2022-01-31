import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMessageGtId, postMessage } from '../utils/Api';
import { generateEncryptedMessage, decryptMessage } from '../utils/Crypto';
import { RootState } from '../redux/Store';
import LocalStorage from '../utils/LocalStoreage';

export type Message = {
    id: number,
    data: string | null,
    timestamp: string | null
    dest: string | null,
    source: string | null
    message: string | null
    self: boolean
}

export type MessagesState = {
    boardMessages: Array<Message>,
    privateConversation: Array<Message>,
    currentPrivate: string,
    id: number,
    fetchActive: boolean,
    sendActive: boolean
}

const initialState: MessagesState = {
    boardMessages: [],
    privateConversation: [],
    currentPrivate: "",
    id: 0,
    fetchActive: false,
    sendActive: false
}

export const resetMessages = createAction<void>('resetMessages')
export const setFetchState = createAction<boolean>('setFetchState')
export const setSendState = createAction<boolean>('setSendState')

export const loadStoredMessages = createAsyncThunk<
    Array<Message>,
    void | string,
    { state: RootState }
>(
    'messages/loadStoredMessages',
    async (arg, thunkApi) => {
        let messages: Array<Message> = []
        let id = 0;
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key)
            if (arg)
                messages = await database.getMessages(arg);
            else
                messages = await database.getMessages(null);
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
        if (database_key != null) {

            for (let destKey of message.destKeys) {
                let encryptedMessage = await generateEncryptedMessage(destKey, keys, message.text, message.dest);
                id = await postMessage(encryptedMessage);
            }
            if (id != -1) {
                let database = await LocalStorage.getStorage(database_key)
                await database.saveMessage(id, "", message.dest, "self", true, message.text)
            }
        }
        thunkApi.dispatch(setSendState(false))
        return id;
    }
);

export const deleteMessages = createAsyncThunk(
    'messages/deleteMessages',
    async (ids: Array<number>) => {
        //todo SQL Lite remove
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
                        if (decryptedMsg.dest != 'board' && decryptedMsg.dest != undefined)
                            decryptedMsg.dest = source
                        await database.saveMessage(decryptedMsg.id, "", decryptedMsg.dest, source, false, decryptedMsg.message)
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
                    if (message.dest == 'board' || message.dest == undefined)
                        state.boardMessages.push(message);
                    else if (message.dest == state.currentPrivate)
                        state.privateConversation.push(message);
                });
                if (action.payload.maxid > state.id)
                    state.id = action.payload.maxid;

            })
            .addCase(deleteMessages.fulfilled, (state, action) => {
                state.boardMessages = state.boardMessages.filter((msg) => {
                    action.meta.arg.some((id) => { msg.id == id })
                })
            })
            .addCase(loadStoredMessages.fulfilled, (state, action) => {
                if (action.meta.arg) {
                    state.privateConversation = []
                    state.currentPrivate = action.meta.arg
                }
                action.payload.forEach((message) => {
                    if (action.meta.arg)
                        state.privateConversation.push(message)
                    else
                        state.boardMessages.push(message)
                    if (+message.id > state.id)
                        state.id = (+message.id)
                });
                console.log(`Loaded ${action.payload.length} messeges. Max id ${state.id}`)
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                console.log("fullfiled ", action.payload)
                if (action.payload != -1) {
                    if (action.meta.arg.dest == 'board')
                        state.boardMessages.push({
                            id: action.payload,
                            data: null,
                            message: action.meta.arg.text,
                            timestamp: null,
                            dest: 'board',
                            source: 'You',
                            self: true
                        });
                    else {
                        state.privateConversation.push({
                            id: action.payload,
                            data: null,
                            message: action.meta.arg.text,
                            timestamp: null,
                            dest: action.meta.arg.dest,
                            source: 'You',
                            self: true
                        });
                    }
                    state.id = action.payload
                }
            })
            .addCase(resetMessages, (state, action) => {
                state.boardMessages = [];
                state.privateConversation = [];
                state.currentPrivate = "";
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