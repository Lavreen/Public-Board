import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { createNewKeys } from '../redux/SecurityReducer';


export default function CreateUserScreeen(): JSX.Element | null  {
    const dispatch = useDispatch();	
    const [password, setPassword] = useState('');

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
        </View>
    )
}
