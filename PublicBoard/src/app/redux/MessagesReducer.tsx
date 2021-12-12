import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Message {
    id: string,
    data: string,
    timestamp: string | null
    source: string | null
    message: string | null
}

export type MessagesState = {
    messages: Array<Message>
}

const initialState: MessagesState = {
    messages: []
}

export const loadStoredMessages = createAsyncThunk(
    'messages/loadStoredMessages',
    async () => {
        //todo SQL Lite import
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageText: string) => {
        //todo REST API POST
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
        //todo REST API get
        const response = await fetch('https://reqres.in/api/users?page=2');
        const messages = await response.json();
        //todo Parse messages
        //todo add to SQL Lite
        return messages;
    }
);


export const MessageStoreSlice = createSlice({
    name: "messages",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            console.log(action.payload.data);
            //todo Add messages to store
        })
        builder.addCase(deleteMessages.fulfilled, (state, action) => {
            //todo Remove messages from state
        })
        builder.addCase(loadStoredMessages.fulfilled, (state, action) => {
            //todo Add messages to store
        })
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            //todo Add messages to store
            //console.log(action.meta.arg)
        })
    }
});

export default MessageStoreSlice.reducer;