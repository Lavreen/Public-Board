import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import LocalStorage from '../utils/LocalStoreage';
import { RootState } from './Store';

type Friend = {
    id: number | null,
    nickname: string,
    pubKey: string
}

export type FriendsState = {
    Friends: Array<Friend>
}

const initialState: FriendsState = {
    Friends: [],
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
    number|null,
    Friend,
    { state: RootState }
>(
    'friends/addFriend',
    async (friend, thunkApi) => {
        let id: number|null = null
        console.log(friend)
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            id = await database.saveFriend(friend.pubKey, friend.nickname);  
        }
       return id
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
            let tmp: Friend = action.meta.arg
            tmp.id = action.payload
            state.Friends.push(tmp);
            console.log("I am adding: ", tmp)
            state.Friends.sort((a: Friend, b: Friend) => {
                return a.nickname.localeCompare(b.nickname);
            })
        })
        builder.addCase(deleteFirend.fulfilled, (state, action) => {
            state.Friends = state.Friends.filter((friend) => { friend.pubKey != action.meta.arg })
        })
    }
});

export type { Friend };
export default FriendsStoreSlice.reducer;