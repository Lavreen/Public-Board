import React, { FC } from "react";
import { Clipboard, Dimensions, ScrollView, View } from "react-native";
import { Appbar, Button, Title } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";
import { styles } from "../assets/paperTheme";
import { RootState } from "../redux/Store";

const ExportScreen: FC = () => {
    const privateKey = useSelector((state: RootState) => state.security.rsa?.private) ?? "Error";
    const publicKey = useSelector((state: RootState) => state.security.rsa?.public) ?? "Error";
    const windowWidth = Dimensions.get('window').width;

    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.Content title="Export" />
            </Appbar.Header>

            <Title style={styles.title && styles.center}>Your public and private key</Title>

            <View>
                <View style={styles.center} >
                    <QRCode
                        size={windowWidth - 20}
                        value={publicKey + ';' + privateKey}
                    />
                </View>
                <Button mode="contained" style={styles.margin} onPress={() => Clipboard.setString(publicKey + ';' + privateKey)}>
                    Copy to clipboard
                </Button>
            </View>

        </ScrollView>
    );
}

export default ExportScreen;