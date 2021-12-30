import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import { KeyPair, RSA } from 'react-native-rsa-native';
import AES from 'react-native-aes-crypto';
import { RootState } from './Store';

//todo Setup aes rsa native code
export enum Status { Active, Initial, Missing, Login, LoginError, Loaded }
export type SecurityState = {
    status: Status,
    rsa: KeyPair | null,
    database: string | null
}

const initialState: SecurityState = {
    status: Status.Initial,
    rsa: null,
    database: null
}

export const setActive = createAction<void>('setActive')

const resetReducer = createAction<void>('resetReducer')


export const deleteData = createAsyncThunk<
    void,
    void,
    { state: RootState }
>(
    'security/deleteData',
    async (arg, thunkApi) => {
        
        EncryptedStorage.removeItem('PublicBoardStore').then(() => {
            thunkApi.dispatch(resetReducer());
        });
    }
)

export const createNewKeys = createAsyncThunk<
    { rsa_keys: KeyPair, database_key: string },
    string,
    { state: RootState }
>(
    'security/createNewKeys',
    async (passphrase) => {
        let data: any = {}

        data.rsa_keys = await RSA.generateKeys(2048);
        data.database_key = await AES.randomKey(32);

        let store: any = {}
        if (passphrase == '') {
            store.encrypted = false;
            store.data = JSON.stringify(data);
        } else {
            try{
                store.encrypted = true;
                let aes_key = await AES.pbkdf2(passphrase, 'salt', 10000, 256)
                let aes_iv = await AES.randomKey(16);
                store.aes_iv = aes_iv;
                store.data = await AES.encrypt(JSON.stringify(data), aes_key, aes_iv, 'aes-256-cbc')
            }catch(e){
                console.log(JSON.stringify(e))
            }
        }
        await EncryptedStorage.setItem('PublicBoardStore', JSON.stringify(store))
        return data;
    }
)

export const loadKeys = createAsyncThunk(
    'security/loadKeys',
    async (passphrase: string | void) => {
        let store = null;
        try {
            store = await EncryptedStorage.getItem('PublicBoardStore');
        } catch (e) {
            return { status: Status.Missing }
        }

        if (store == null) return { status: Status.Missing };
        store = await JSON.parse(store);

        if (!store.encrypted) return { status: Status.Loaded, data: await JSON.parse(store.data) };

        if (!passphrase) return { status: Status.Login };

        let aes_key = await AES.pbkdf2(passphrase, 'salt', 10000, 256);
        try {
            store.data = await AES.decrypt(store.data, aes_key, store.aes_iv, 'aes-256-cbc');
            store.data = await JSON.parse(store.data);
            return { status: Status.Loaded, data: store.data };
        } catch (e) {
            return { status: Status.LoginError }
        }
    }
);

export const SecurityStoreSlice = createSlice({
    name: "security",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadKeys.fulfilled, (state, action) => {
                state.status = action.payload.status;
                if (action.payload.status == Status.Loaded) {
                    state.rsa = { private: action.payload.data.rsa_keys.private, public: action.payload.data.rsa_keys.public };
                    state.database = action.payload.data.database_key;
                }
            })
            .addCase(createNewKeys.fulfilled, (state, action) => {
                state.status = Status.Loaded;
                state.rsa = { private: action.payload.rsa_keys.private, public: action.payload.rsa_keys.public };
                state.database = action.payload.database_key;
            })
            .addCase(resetReducer, (state, action) => {
                state.status = Status.Initial;
                state.rsa = null;
                state.database = null;
            })
            .addCase(setActive, (state, action) => {
                state.status = Status.Active;
            })
    }
});


export default SecurityStoreSlice.reducer;