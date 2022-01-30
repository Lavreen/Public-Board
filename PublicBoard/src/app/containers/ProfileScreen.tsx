import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

export default function ProfileScreen() {
    const publicKey = 
    `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDn4Ehf/Dz6FKKN8vvAf1bjn7ET
    02yczy0t24zWBOynfG5lsyi1TLKHq6ZBvSRMFStmPpl8lJ8oSw25D5/O//DpA9AA
    zWcCrfnI6CFyu2bscvidVZAePLghuoHP+rnoHL8MtKTuIM9CRc7PhOloZCNWg5nm
    cVV+RvdGfkwtpwgf0QIDAQAB
    -----END PUBLIC KEY-----`
    //useSelector((state: RootState) => state.security.rsa?.public);
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