import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Button title="Login" onPress={() => navigation.navigate('Home')}></Button>
        </View>
    );
}