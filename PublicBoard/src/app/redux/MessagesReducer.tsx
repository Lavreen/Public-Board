import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLastMessages, getMessageById, getMessageGtId, postMessage } from '../utils/Api';
import { EncryptedMessage, generateEncryptedMessage, decryptMessage } from '../utils/Crypto';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import LocalStorage from '../utils/LocalStoreage';

export type Message = {
    id: string,
    data: string | null,
    timestamp: string | null
    source: string | null
    message: string | null
}

export type MessagesState = {
    messages: Array<Message>,
    id: number,
    selfid: number
}

const initialState: MessagesState = {
    messages: [],
    id: 0,
    selfid: 0
}

export const loadStoredMessages = createAsyncThunk<
    { messages: Array<Message>, id: number, selfid: number },
    void,
    { state: RootState }
>(
    'messages/loadStoredMessages',
    async (arg, thunkApi) => {
        let messages: Array<Message> = []
        let id = 0, selfid = 0;

        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key)
            messages = await database.getMessages(null);
            //todo get last message id and last sent message id
        }
        return { messages: messages, id: id, selfid: selfid }
    }
);

export const sendMessage = createAsyncThunk<
    EncryptedMessage,
    { text: string, destKey: string },
    { state: RootState }
>(
    'messages/sendMessage',
    async (message: { text: string, destKey: string }, thunkApi) => {
        const keys = thunkApi.getState().security.rsa
        console.log("try to send")
        let encryptedMessage = await generateEncryptedMessage(message.destKey, keys, message.text)
        console.log("po try to send")
        await postMessage(encryptedMessage)

        return encryptedMessage;
    }
);

export const deleteMessages = createAsyncThunk(
    'messages/deleteMessages',
    async (ids: Array<string>) => {
        //todo SQL Lite remove
    }
);



export const fetchMessages = createAsyncThunk<
    Array<Message>,
    string | void,
    { state: RootState }
>(
    'messages/fetchMessages',
    async (arg, thunkApi) => {
        let messages: Array<Message> = []
        let database_key = thunkApi.getState().security.database

        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key)

            //todo get latest message id from SQL Lite
            let id = thunkApi.getState().message.id.toString();
            const data = await getMessageGtId(id);
            let private_key
            if (arg)
                private_key = arg
            else
                private_key = thunkApi.getState().security.rsa?.private


            if (private_key != null) {
                for (let item of data) {
                    let decryptedMsg = await decryptMessage(item, private_key)
                    if (decryptedMsg != null && decryptedMsg.message != null) {
                        messages.push(decryptedMsg)
                        //todo timestamps source when null
                        let source = decryptedMsg.source
                        if (source == null) source = ""
                        let timestamp = decryptedMsg.source
                        if (timestamp == null) timestamp = ""
                        await database.saveMessage(decryptedMsg.id, timestamp, source, false, decryptedMsg.message)
                    } else {
                        messages.push
                    }
                }

            }
        }
        return messages;
    }
);

export const resetMessages = createAction<void>('resetMessages')

export const MessageStoreSlice = createSlice({
    name: "messages",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.fulfilled, (state, action) => {
                let maxid = state.id;
                action.payload.forEach(
                    (message) => {
                        //fech from id not yet implemented need guard
                        if (state.id < (+message.id)) {
                            state.messages.push(message)
                        }
                        if ((+message.id) > maxid) {
                            maxid = (+message.id);
                        }
                        state.id = maxid
                    }
                );
            })
            .addCase(deleteMessages.fulfilled, (state, action) => {
                state.messages = state.messages.filter((msg) => {
                    action.meta.arg.some((id) => { msg.id == id })
                })
            })
            .addCase(loadStoredMessages.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.selfid = action.payload.selfid;
                action.payload.messages.forEach(
                    (message) => state.messages.push(message)
                );
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push({
                    id: `SELF-${state.selfid}`,
                    // data: action.payload,
                    data: null,
                    message: action.meta.arg.text,
                    timestamp: null,
                    source: 'SELF'
                });
                state.selfid++;
            })
            .addCase(resetMessages, (state, action) => {
                state.messages = [];
                state.id = 0;
            })
    }
});

export default MessageStoreSlice.reducer;