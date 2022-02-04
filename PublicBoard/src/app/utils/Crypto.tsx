import { RSA, KeyPair } from 'react-native-rsa-native';
import { NativeModules, Platform } from 'react-native'
import AES from 'react-native-aes-crypto'
import { Message } from "../redux/MessagesReducer"
import { postMessage } from "./Api"
//import { randomBytes } from 'react-native-randombytes'
//npm i react-native-randombytes

export type RawMessage = {
    sign: string | null
    pub_key: string | null, //
    text: string,  //Message contents
    dest: string   //board or pub_key
}


//let MESSAGE_CONTENTS = Aes.encrypt( JSON.stringify(raw_message));

export type EncryptedMessage = {
    id: number,
    key: string,  //RSA(AES KEY)
    data: string,  //AES(MESSAGE_CONTENTS) in other words 
};

export async function validateKeyPair(keys: string): Promise<boolean> {
    try {
        let splited = keys.split(';')
        let rsa_keys = {
            public: splited[0],
            private: splited[1]
        }

        let signature = await RSA.sign("Sign", rsa_keys.private)
        return await RSA.verify(signature, "Sign", rsa_keys.public)
    } catch {
        return false
    }
}

export async function generateEncryptedMessage(dest_key: string, your_key: KeyPair | null, text: string, dest: string): Promise<EncryptedMessage> {
    let aes_iv = await AES.randomKey(16);
    let aes_key = await AES.randomKey(16);
    let aes_key_encrypted = await RSA.encrypt(aes_iv + aes_key, dest_key);
    let data: RawMessage = { sign: null, pub_key: null, text: text, dest: dest };
    if (your_key != null) {
        data.pub_key = your_key.public;
        let hash = await AES.sha256(text);
        data.sign = await RSA.sign(hash, your_key.private);
    }
    let encrypted_data = await AES.encrypt(JSON.stringify(data), aes_key, aes_iv, 'aes-128-cbc')

    let message: EncryptedMessage = {
        id: 0,
        key: aes_key_encrypted,
        data: encrypted_data
    };

    return message;
}

export async function decryptMessage(message: EncryptedMessage, private_key: string): Promise<Message | null> {
    try {
        let aes_key = await RSA.decrypt(message.key, private_key);
        let aes_iv = aes_key.slice(0, 32)
        aes_key = aes_key.slice(32)

        let decrypted_data = await AES.decrypt(message.data, aes_key, aes_iv, 'aes-128-cbc')
        decrypted_data = await JSON.parse(decrypted_data);
        let msg: Message = {
            id: message.id,
            data: message.data,
            timestamp: "",
            dest: decrypted_data.dest,
            source: decrypted_data.pub_key,
            message: decrypted_data.text
        }
        return msg
    }
    catch (e) {
        let msg: Message = {
            id: message.id,
            data: message.data,
            timestamp: null,
            dest: 'board',
            source: null,
            message: null
        }
        return msg
    }
}

//todo
export async function validateMessage() { }

export async function test() {
    /*
    let message = "WIADOMOŚĆ ODD WIEPRZA";
    let aes_iv = await AES.randomKey(16);
    console.log(aes_iv);
    console.log(`sending: ${message}`)
    let keysa : KeyPair = await RSA.generateKeys(2048);
    let keysb : KeyPair = await RSA.generateKeys(2048);
    let encrypted = await RSA.encrypt(message, keysa.public);
    try {
        let decrypted = await RSA.decrypt(encrypted, keysa.private);
        console.log(`right one:${decrypted}`);
        decrypted = await RSA.decrypt(encrypted, keysb.private);
        console.log(`wrong one:${decrypted}`);
    }
    catch(e){
        console.log(e)
    }
    console.log('Ended')
    */
    let message = "WIADOMOŚĆ";
    let keysa: KeyPair = await RSA.generateKeys(2048);
    let keysb: KeyPair = await RSA.generateKeys(2048);

    // let it = await generateEncryptedMessage(keysb.public, keysa, message);
    // // console.log("Enc AES-key ", it.key)
    // // console.log("Enc data ", it.data)
    // it['id']=2
    // console.log("klucz A")
    // let msg = await decryptMessage(it, keysa.private)
    // if(msg != null){
    //     console.log(JSON.stringify(msg.message))
    // }else{
    //     console.log('nie do ciebie')
    // }

    // console.log("klucz B")
    // msg = await decryptMessage(it, keysb.private)
    // if(msg != null){
    //     console.log(JSON.stringify(msg.message))
    // }else{
    //     console.log('nie do ciebie')
    // }


    console.log("...")
    console.log("prywatny")
    console.log(keysa.private)
    console.log("...")
    console.log("publiczny")
    console.log(keysa.public)
    console.log("...")

    // await postMessage(it)

}