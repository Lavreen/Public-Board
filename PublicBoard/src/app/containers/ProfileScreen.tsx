import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

export default function ProfileScreen() {
    const publicKey = useSelector((state: RootState) => state.security.rsa?.public);
    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={styleSheet.center}>
            <QRCode
                size={windowWidth - 10}
                value={publicKey}
            />
        </View>
    );
}

const styleSheet = StyleSheet.create({
    center:{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})