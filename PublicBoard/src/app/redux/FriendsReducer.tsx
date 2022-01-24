import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import LocalStorage from '../utils/LocalStoreage';
import { RootState } from './Store';

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

export const loadFriends = createAsyncThunk<
Array<Friend>,
void,
{ state: RootState }
>(
    'friends/loadFriends',
    async (arg, thunkApi) => {
        let friends: Array<Friend> = []

        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            friends = await database.getFiends()
        }
        return friends;
    }
);

export const addFriend = createAsyncThunk<
    void,
    Friend,
    { state: RootState }
>(
    'friends/addFirend',
    async (friend, thunkApi) => {
        console.log(friend)
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            await database.saveFriend(friend.pubKey, friend.nickname, friend.id);
        }

    }
);

export const deleteFirend = createAsyncThunk(
    'friends/deleteFirend',
    async (pubkey: string) => {
        //todo SQL Lite delete
    }
);

export const FriendsStoreSlice = createSlice({
    name: "friends",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadFriends.fulfilled, (state, action) => {
            action.payload.forEach(
                (friend) => state.Friends.push(friend)
            );
        })
        builder.addCase(addFriend.fulfilled, (state, action) => {
            state.Friends.push(action.meta.arg);
            state.max_id += 1;
        })
        builder.addCase(deleteFirend.fulfilled, (state, action) => {
            state.Friends = state.Friends.filter((friend) => { friend.pubKey != action.meta.arg })
        })
    }
});

export type { Friend };
export default FriendsStoreSlice.reducer;