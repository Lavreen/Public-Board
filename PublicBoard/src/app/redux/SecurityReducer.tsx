import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import { KeyPair, RSA } from 'react-native-rsa-native';
import AES from 'react-native-aes-crypto';
import { RootState } from './Store';

//todo Setup aes rsa native code
export enum Status{Initial, Missing, Login, Loaded}
export type SecurityState = {
    status: Status,
    rsa: KeyPair | null
}

const initialState: SecurityState = {
    status: Status.Initial,
    rsa: null
}

export const createNewKeys = createAsyncThunk<
    void,
    string,
    { state: RootState }
>(
    'security/createNewKeys',
    async (passphrase)=>{
        let store: any = {}
		store.keys = await RSA.generateKeys(2048);

        if(passphrase == ''){
            store.encrypted = false;
        }else{
            store.encrypted = true;
			let password = await AES.pbkdf2(passphrase, 'salt', 10000, 256)

        }
    }
)

export const loadKeys = createAsyncThunk(
    'security/loadKeys',
    async (passphrase: string | void) => {
        // return await RSA.generateKeys(2048);
        try {
            const store = await EncryptedStorage.getItem("PublicBoardStore");
            if (store != null) {
                const data = JSON.parse(store!);
                if (data.encrypted) {
                    if(passphrase){

                    }else{
                        return Status.Login
                    }
                    //todo AES sha256 passphrase -> AES decrypt data entries
                    return data;
                } else {
                    return data;
                }
            } else {
                return Status.Missing
            }
        } catch (error) {
            return Status.Missing
        }
    }
);

export const SecurityStoreSlice = createSlice({
    name: "security",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadKeys.fulfilled, (state, action) => {
            if(action.payload == Status.Missing){
                state.status = Status.Missing
            }else if(action.payload == Status.Login){
                state.status = Status.Login
            }else{
                state.rsa = action.payload
            }
        })
    }
});


export default SecurityStoreSlice.reducer;