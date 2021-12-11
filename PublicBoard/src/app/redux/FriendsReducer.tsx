import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//todo SQL Lite dependency
type Friend = {
    nickname: string,
    pubKey: string
}

export type FriendsState = {
    Friends: Array<Friend>
}

const initialState: FriendsState = {
    Friends: []
}

export const loadFriends = createAsyncThunk(
    'friends/loadFriends',
    async () => {
        //todo SQL Lite import
    }
);

export const addFirend = createAsyncThunk(
    'friends/addFirend',
    async (friend: Friend) => {
        //todo SQL Lite save
    }
);

export const deleteFirend = createAsyncThunk(
    'friends/deleteFirend',
    async (friend: Friend) => {
        //todo SQL Lite save
    }
);

export const FriendsStoreSlice = createSlice({
    name: "friends",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadFriends.fulfilled, (state, action) => {
            //todo add friends to state
        })
        builder.addCase(addFirend.fulfilled, (state, action) => {
            //todo add friend to state
        })
        builder.addCase(deleteFirend.fulfilled, (state, action) => {
            //todo remove friend from state
        })
    }
});

export default FriendsStoreSlice.reducer;