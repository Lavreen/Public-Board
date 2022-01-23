import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { styles, theme } from '../assets/paperTheme';
import { Text, TextInput, Surface, Button, DefaultTheme, Provider as PaperProvider, List, Menu, Title } from 'react-native-paper';
import { createNewKeys } from '../redux/SecurityReducer';


export default function CreateUserScreeen(): JSX.Element | null  {
    const dispatch = useDispatch();	
    const [password, setPassword] = useState('');

    return(
        <PaperProvider theme={theme}>
            <Surface style={styles.title}>
                <Image source={require('../assets/logo.png')}></Image>
                <Title>Public Board</Title>
                <Title>Creating new Account</Title>
            </Surface>
            <Text></Text>
            <Text>Password (optional)</Text>
            <TextInput
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <Text></Text>
            {/* <Button title="Create Account" onPress={() => dispatch(createNewKeys(password))}></Button> */}
            <Button mode="contained" onPress={() => dispatch(createNewKeys(password))}>
            Create Account
                </Button>
        </PaperProvider>
    )
}

