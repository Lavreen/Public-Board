import React, { FC } from 'react';
import { Clipboard, Dimensions, View } from 'react-native';
import { Appbar, Button, Title } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { styles } from '../assets/paperTheme';

const ProfileScreen: FC = () => {
    const publicKey = useSelector((state: RootState) => state.security.rsa?.public) ?? "error";
    const windowWidth = Dimensions.get('window').width;

    return (
        <View>
            <Appbar.Header>
                <Appbar.Content title="Profile" />
            </Appbar.Header>

            <Title style={styles.title && styles.center}>Your public key</Title>

            <View style={styles.center} >
                <QRCode
                    size={windowWidth - 20}
                    value={publicKey}
                />
            </View>

            <Button mode="contained" style={styles.margin} onPress={() => Clipboard.setString(publicKey)}>
                Copy to clipboard
            </Button>
        </View>
    );
}

export default ProfileScreen;