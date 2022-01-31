import React, { useState } from 'react';
import { Image, KeyboardAvoidingView } from 'react-native';
import { useDispatch } from 'react-redux';
import { styles, theme } from '../assets/paperTheme';
import { TextInput, Button, Provider as PaperProvider, Title } from 'react-native-paper';
import { createNewKeys } from '../redux/SecurityReducer';
import { ScrollView } from 'react-native-gesture-handler';


export default function CreateUserScreeen(): JSX.Element | null {
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');

    return (
        <PaperProvider theme={theme}>
            <ScrollView>
                <Image style={styles.center} source={require('../assets/logo.png')}></Image>
                <Title style={styles.title} >Public Board</Title>
                <Title style={styles.title} >Creating new Account</Title>

                <KeyboardAvoidingView behavior="padding">
                    <TextInput
                        label={"Password"}
                        mode="outlined"
                        secureTextEntry
                        style={styles.margin}
                        onChangeText={(text) => setPassword(text)}
                    />
                </KeyboardAvoidingView>
                <Button style={styles.margin} mode="contained" onPress={() => dispatch(createNewKeys(password))}>
                    Create Account
                </Button>
            </ScrollView>
        </PaperProvider>
    )
}

