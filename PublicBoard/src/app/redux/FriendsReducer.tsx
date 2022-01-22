import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//todo SQL Lite dependency
type Friend = {
    id: number,
    nickname: string,
    pubKey: string
}

export type FriendsState = {
    Friends: Array<Friend>
    max_id: number
}

const initialState: FriendsState = {
    Friends: [],
    max_id: 0
}

export const loadFriends = createAsyncThunk(
    'friends/loadFriends',
    async () => {
        //todo SQL Lite import
        let friends: Array<Friend> = []

        return friends;
    }
);

export const addFriend = createAsyncThunk(
    'friends/addFirend',
    async (friend: Friend) => {
        //todo SQL Lite save
    }
);

export const deleteFirend = createAsyncThunk(
    'friends/deleteFirend',
    async (pubkey: string) => {
        //todo SQL Lite save
    }
);

export const FriendsStoreSlice = createSlice({
    name: "friends",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadFriends.fulfilled, (state, action) => {
            action.payload.forEach(
                (friend)=>state.Friends.push(friend)
            ); 
        })
        builder.addCase(addFriend.fulfilled, (state, action) => {
            state.Friends.push(action.meta.arg);
            state.max_id += 1;
        })
        builder.addCase(deleteFirend.fulfilled, (state, action) => {
            state.Friends = state.Friends.filter((friend)=>{friend.pubKey != action.meta.arg})
        })
    }
});

export type {Friend};
export default FriendsStoreSlice.reducer;