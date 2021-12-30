import React from 'react';
import { View, Text, Button, Image, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { deleteData } from '../redux/SecurityReducer';

export default function HomeScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const publicKey = useSelector((state: RootState) => state.security.rsa?.public);

    return (
        <View>
            <Image source={require('../assets/logo.png')}></Image>
            <Text>Public Board</Text>
            <Button title="Messages" onPress={() => navigation.navigate('Messages')} ></Button>
            <Button title="New message" onPress={() => navigation.navigate('CreateMessage')}></Button>
            <Button title="Friends" onPress={() => navigation.navigate('Friends')}></Button>
            <Button title="Board" onPress={() => navigation.navigate('Board')} ></Button>
            <Button title="Delete User Data" onPress={() => dispatch(deleteData())}></Button>
            <Text> {publicKey} </Text>
        </View >
    );
}