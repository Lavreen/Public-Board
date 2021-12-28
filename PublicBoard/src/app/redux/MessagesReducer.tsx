import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLastMessages, getMessageById, postMessage } from '../utils/Api';
import { EncryptedMessage, generateEncryptedMessage } from '../utils/Crypto';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

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

export const loadStoredMessages = createAsyncThunk(
    'messages/loadStoredMessages',
    async () => {
        //todo SQL Lite import
        let messages: Array<Message> = []
        //todo get last message id and last sent message id
        let id = 0, selfid = 0;
        return { messages: messages, id: id, selfid: selfid }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (message: { text: string, destKey: string }) => {
        //todo encrypt message
        const dispatch = useDispatch();
        const keys = useSelector((state: RootState) => state.security!.rsa)
        let encryptedMessage = await generateEncryptedMessage(message.destKey, keys, message.text)

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

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async () => {
        //todo get latest message id from SQL Lite
        // const data = await getMessageById();
        const data = await getLastMessages();
        let messages: Array<Message> = []
        //todo decrypt and resolve accruate timestamp and pubkey
        for (let item of data) {
            messages.push({
                id: item.id,
                data: null,
                timestamp: item.pub_date,
                source: null,
                message: item.message_text
            });
        }
        return messages;
    }
);


export const MessageStoreSlice = createSlice({
    name: "messages",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            let maxid = state.id;
            action.payload.forEach(
                (message) => {
                    //fech from id not yet implemented need guard
                    if(state.id< (+message.id)){
                        state.messages.push(message)
                    }
                    if((+message.id) > maxid) {
                        maxid = (+message.id);
                    }
                    state.id = maxid
                }
            );
        })
        builder.addCase(deleteMessages.fulfilled, (state, action) => {
            state.messages = state.messages.filter((msg) => {
                action.meta.arg.some((id) => { msg.id == id })
            })
        })
        builder.addCase(loadStoredMessages.fulfilled, (state, action) => {
            state.id = action.payload.id;
            state.selfid = action.payload.selfid;
            action.payload.messages.forEach(
                (message) => state.messages.push(message)
            );
        })
        builder.addCase(sendMessage.fulfilled, (state, action) => {
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
    }
});

export default MessageStoreSlice.reducer;