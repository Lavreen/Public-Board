import React, { useState } from 'react';
import { View, TextInput, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteData, loadKeys } from '../redux/SecurityReducer';
import { Text, Surface, Button, Provider as PaperProvider, Title } from 'react-native-paper';
import { styles, theme } from '../assets/paperTheme';


export default function LoginScreen(): JSX.Element | null  {
    const dispatch = useDispatch();	
    const [password, setPassword] = useState('');

    return(
        <PaperProvider theme={theme}>
            <Surface style={styles.title}>
                <Image source={require('../assets/logo.png')}></Image>
                <Title>Public Board</Title>
                <Title>Passprase login required</Title>
            </Surface>
                <Text>Password</Text>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Button mode="contained" onPress={() => dispatch(loadKeys(password))}>Login</Button>
                <Text></Text>
                
                <Button mode="contained" onPress={() => dispatch(deleteData())}>Wipe User Data</Button>
        </PaperProvider>
    )
}
