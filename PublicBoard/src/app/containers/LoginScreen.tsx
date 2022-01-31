import React, { useState } from 'react';
import { Image, KeyboardAvoidingView } from 'react-native';
import { useDispatch } from 'react-redux';
import { loadKeys } from '../redux/SecurityReducer';
import { TextInput, Button, Title } from 'react-native-paper';
import { styles } from '../assets/paperTheme';
import { ScrollView } from 'react-native-gesture-handler';


export default function LoginScreen(): JSX.Element | null {
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');

    return (
        <ScrollView>
            <Image style={styles.center} source={require('../assets/logo.png')}></Image>
            <Title style={styles.title} >Public Board</Title>
            <Title style={styles.title} >Passprase login required</Title>

            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    label={"Password"}
                    mode="outlined"
                    secureTextEntry
                    style={styles.margin}
                    onChangeText={(text) => setPassword(text)}
                />
                <Button style={styles.margin} mode="contained" onPress={() => dispatch(loadKeys(password))}>Login</Button>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}
