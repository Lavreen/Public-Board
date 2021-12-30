import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { test } from "../utils/Crypto"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { createNewKeys, loadKeys, Status } from '../redux/SecurityReducer';

export default function LoginScreen() {
    // test();
    const navigation = useNavigation();
    const dispatch = useDispatch();	
    const status = useSelector((state: RootState) => state.security.status)
    const [password, setPassword] = useState('');

    if(status == Status.Initial){
        dispatch(loadKeys())
        return (
            <View>
                <ActivityIndicator size="large"/>
            </View>
        )
    }else if(status == Status.Missing){
        return(
            <View>
                <Text>Create new Account</Text>
                <Text></Text>
                <Text>Password (optional)</Text>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Button title="Create Account" onPress={() => dispatch(createNewKeys(password))}></Button>
                <Button title="HOME" onPress={() => navigation.navigate('Home')}></Button>

            </View>
        )
    }else if(status == Status.Login){
        return(
            <View>
                <Text>Passprase login required </Text>
                <Text></Text>
                <Text>Password</Text>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Button title="Login" onPress={() => loadKeys(password)}></Button>
            </View>
        )
    }else if(status == Status.Loaded){
        navigation.navigate('Home');
    }
    return(
        <View>
            <Text>ERROR</Text>
            <Button title="HOME" onPress={() => navigation.navigate('Home')}></Button>
        </View>
    )
}
