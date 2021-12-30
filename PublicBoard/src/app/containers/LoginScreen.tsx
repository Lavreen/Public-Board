import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteData, loadKeys } from '../redux/SecurityReducer';


export default function LoginScreen(): JSX.Element | null  {
    const dispatch = useDispatch();	
    const [password, setPassword] = useState('');

    return(
        <View>
            <Text>Passprase login required </Text>
            <Text></Text>
            <Text>Password</Text>
            <TextInput
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <Button title="Login" onPress={() => dispatch(loadKeys(password))}></Button>
            <Button title="Delete User Data" onPress={() => dispatch(deleteData())}></Button>
            
        </View>
    )
}
