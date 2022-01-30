import React from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { loadKeys, setActive, Status } from '../redux/SecurityReducer';
import MainNavigator from '../navigation/MainNavigator';
import LoginScreen from './LoginScreen';
import CreateUserScreeen from './CreateUserScreen';
import { Surface, Provider as PaperProvider, Title } from 'react-native-paper';
import { styles, theme } from '../assets/paperTheme';
import { loadFriends } from '../redux/FriendsReducer';
import { loadStoredMessages } from '../redux/MessagesReducer';

export default function RootScreen(): JSX.Element | null {
    const status = useSelector((state: RootState) => state.security.status)
    const dispatch = useDispatch();

    if (status == Status.Active) {
        return (
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        )
    }

    if (status == Status.Initial) {
        dispatch(loadKeys())
        return null
    }

    if (status == Status.Missing)
        return (<CreateUserScreeen></CreateUserScreeen>);

    if (status == Status.Login || status == Status.LoginError)
        return (<LoginScreen></LoginScreen>)

    if (status == Status.Loaded) {
        dispatch(loadFriends())
        dispatch(loadStoredMessages())
        setTimeout(() => { dispatch(setActive()) }, 2000)
        return (
            <PaperProvider theme={theme}>
                <Surface style={styles.title}>
                    <Image source={require('../assets/logo.png')}></Image>
                    <Title>Welcome to...</Title>
                    <Title>Public Board</Title>
                </Surface>
            </PaperProvider>
        )
    }
    return null;
}
