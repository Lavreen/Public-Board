import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { test } from "../utils/Crypto"

export default function LoginScreen() {
    const navigation = useNavigation();
    test();
    return (
        <View>
            <Button title="Login" onPress={() => navigation.navigate('Home')}></Button>
        </View>
    );
}