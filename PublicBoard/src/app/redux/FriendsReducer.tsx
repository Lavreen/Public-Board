import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { act } from 'react-test-renderer';
import LocalStorage from '../utils/LocalStoreage';
import { RootState } from './Store';

type Friend = {
    id: number,
    nickname: string,
    pubKey: string
}

export type FriendWithMsg = {
    friend: Friend
    msg: string
}

export type FriendsState = {
    Friends: Array<Friend>
    FriendsWithMsgs: Array<FriendWithMsg>
}

const initialState: FriendsState = {
    Friends: [],
    FriendsWithMsgs: [],
}

export const resetFriends = createAction<void>('resetFriends')

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


export const loadLastMessages = createAsyncThunk<
    Array<FriendWithMsg>,
    void,
    { state: RootState }
>(
    'messages/loadLastMessages',
    async (friends, thunkApi) => {

        let friendsWithMsg: Array<FriendWithMsg> = []
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            friendsWithMsg = await database.getFriendsWithMsgs()
        }
        return friendsWithMsg
    }

)

export const checkPubKey = createAsyncThunk<
boolean,
string,
{state: RootState}
>(
    'friends/checkKey',
    async (pubKey, thunkApi) => {
        let ifExists: number = 0
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            ifExists = await database.checkPubKey(pubKey);  
        }
        if(ifExists == 0)
            return false
        else
            return true
    }

)

export const addFriend = createAsyncThunk<
    number|null,
    {pubKey: string, nickname: string},
    { state: RootState }
>(
    'friends/addFriend',
    async (friend, thunkApi) => {
        let id: number|null = null
        //console.log(friend)
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            id = await database.saveFriend(friend.pubKey, friend.nickname);  
        }

       return id;
    }
);

export const deleteFriends = createAsyncThunk<
void,
Array<number>,
{ state: RootState }
>(
    'friends/deleteFriends',
    async (friendsToDel, thunkApi) => {
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            await database.deleteFriends(friendsToDel)
        }
    }
);

export const editFriend = createAsyncThunk<
void,
Friend,
{ state: RootState }
>(
    'friends/editFriend',
    async (friendToEdit, thunkApi) => {
        let database_key = thunkApi.getState().security.database
        if (database_key != null) {
            let database = await LocalStorage.getStorage(database_key);
            await database.editFriend(friendToEdit)
        }
    }
);

export const FriendsStoreSlice = createSlice({
    name: "friends",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadFriends.fulfilled, (state, action) => {
                action.payload.forEach(
                    (friend) => state.Friends.push(friend)
                );
            })
            .addCase(loadLastMessages.fulfilled, (state, action) => {
                state.FriendsWithMsgs = []
                action.payload.forEach(
                    (friendWithMsg) => state.FriendsWithMsgs.push(friendWithMsg)
                );
            })
            .addCase(addFriend.fulfilled, (state, action) => {
                let id = action.payload
                if(id != null){
                    let toAdd: Friend = {
                        id: id, 
                        pubKey: action.meta.arg.pubKey,
                        nickname: action.meta.arg.nickname
                    }
                    state.Friends.push(toAdd)
                    state.Friends.sort((a: Friend, b: Friend) => {
                        return a.nickname.localeCompare(b.nickname);
                    })
                }  
            })
            .addCase(checkPubKey.fulfilled, (state, action) => {

            })
            .addCase(deleteFriends.fulfilled, (state, action) => {
                action.meta.arg.forEach(
                    (id) => state.Friends.splice(state.Friends.findIndex(
                        (friend) => friend.id == id
                    ), 1)
                )
                state.Friends.sort((a: Friend, b: Friend) => {
                    return a.nickname.localeCompare(b.nickname);
                })
            })
            .addCase(editFriend.fulfilled, (state, action) => {
                let id = action.meta.arg.id
                state.Friends.forEach(function(item, i) { 
                    if (item.id == id) 
                        state.Friends[i] = action.meta.arg; }
                );
                state.Friends.sort((a: Friend, b: Friend) => {
                    return a.nickname.localeCompare(b.nickname);
                })
            })
            .addCase(resetFriends, (state, action) => {
                state.Friends = []
            })
    }
});

export type { Friend };
export default FriendsStoreSlice.reducer;