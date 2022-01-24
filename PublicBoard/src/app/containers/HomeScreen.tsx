import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { deleteData } from '../redux/SecurityReducer';
import { Surface, Button, Title } from 'react-native-paper';
import { styles } from '../assets/paperTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const publicKey = useSelector((state: RootState) => state.security.rsa?.public);

    return (

        <SafeAreaView style={styles.container}>
            <Surface style={styles.title}>
            <Image source={require('../assets/logo.png')}></Image>
            <Title>Public Board</Title>
            </Surface>
            <Surface style={styles.surface}>
                <Button mode="contained" style={styles.homeScreenButton} onPress={() => navigation.navigate('Messages')}>
                    Messages
                </Button>
                <Button mode="contained" style={styles.homeScreenButton} onPress={() => navigation.navigate('CreateMessage')}>
                    New message
                </Button>
                <Button mode="contained" style={styles.homeScreenButton} onPress={() => navigation.navigate('Friends')}>
                Friends
                </Button>
                <Button mode="contained" style={styles.homeScreenButton} onPress={() => navigation.navigate('Board')}>
                Board
                </Button>
                <Button mode="contained" style={styles.homeScreenButton} onPress={() => dispatch(deleteData())}>
                Wipe Data
                </Button>
            </Surface>
        </SafeAreaView>
     
    );
}