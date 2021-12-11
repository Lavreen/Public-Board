import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <View>
            <Image source={require('../assets/logo.png')}></Image>
            <Text>Public Board</Text>
            <Button title="Messages" onPress={() => navigation.navigate('Messages')} ></Button>
            <Button title="New message" onPress={() => navigation.navigate('CreateMessage')}></Button>
            <Button title="Friends" onPress={() => navigation.navigate('Friends')}></Button>
            <Button title="Board" onPress={() => navigation.navigate('Board')} ></Button>
        </View >
    );
}