import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import { KeyPair } from 'react-native-rsa-native';

//todo Setup aes rsa native code

export type SecurityState = {
    rsa: KeyPair
} | null

const initialState: SecurityState = null


export const loadKeys = createAsyncThunk(
    'security/loadKeys',
    async (passphrase: string | null) => {
        try {
            const store = await EncryptedStorage.getItem("PublicBoardStore");
            if (store != undefined) {
                const data = JSON.parse(store);
                if (data.encrypted) {
                    //todo AES sha256 passphrase -> AES decrypt data entries
                    return data;
                } else {
                    return data;
                }
            } else {
                //error missing store
            }
        } catch (error) {
            //error missing store
        }
    }
);

export const SecurityStoreSlice = createSlice({
    name: "security",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadKeys.fulfilled, (state, action) => {
            console.log(action.payload)
        })
    }
});


export default SecurityStoreSlice.reducer;