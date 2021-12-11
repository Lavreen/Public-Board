import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FriendsScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Button title="Go Back" onPress={() => navigation.navigate('Home')}></Button>
        </View>
    );
}