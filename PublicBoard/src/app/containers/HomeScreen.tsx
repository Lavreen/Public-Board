import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { deleteData } from '../redux/SecurityReducer';
import { Text, Surface, Button, DefaultTheme, Provider as PaperProvider, List, Menu, Title } from 'react-native-paper';
import { styles, theme } from '../assets/paperTheme';

export default function HomeScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const publicKey = useSelector((state: RootState) => state.security.rsa?.public);

    return (
        <PaperProvider theme={theme}>
            <Surface style={styles.title}>
            <Image source={require('../assets/logo.png')}></Image>
            <Title>Public Board</Title>
            </Surface>
            <Surface style={styles.surface}>
                <Button mode="contained" onPress={() => navigation.navigate('Messages')}>
                    Messeges
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('CreateMessage')}>
                    New message
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Friends')}>
                Friends
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Board')}>
                Board
                </Button>
                <Button mode="contained" onPress={() => dispatch(deleteData())}>
                Wipe Data
                </Button>
            </Surface>
            <Text> {publicKey} </Text>
        </PaperProvider >
    );
}