import React, { useCallback, useState } from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { styles, theme } from '../assets/paperTheme';
import { TextInput, Button, Provider as PaperProvider, Title, Portal, Modal } from 'react-native-paper';
import { createNewKeys } from '../redux/SecurityReducer';
import { ScrollView } from 'react-native-gesture-handler';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { validateKeyPair } from '../utils/Crypto';


export default function CreateUserScreeen(): JSX.Element | null {
    const dispatch = useDispatch();
    const [password, setPassword] = useState<string>('');
    const [importedKeys, setImportedKeys] = useState<string>('');
    const [importModal, setImportModal] = useState<boolean>(false);
    const [readError, setReadError] = useState<boolean>(false);

    const setImported = useCallback((data) => {
        setImportedKeys(data)
        setImportModal(false)
    }, [])

    return (
        <PaperProvider theme={theme}>
            <ScrollView>
                <Image style={styles.center} source={require('../assets/logo.png')}></Image>
                <Title style={styles.title} >Public Board</Title>
                <Title style={styles.title} >Creating new Account</Title>

                <KeyboardAvoidingView behavior="padding">
                    <TextInput
                        label={"Password"}
                        mode="outlined"
                        secureTextEntry
                        style={styles.margin}
                        onChangeText={(text) => setPassword(text)}
                    />
                </KeyboardAvoidingView>
                <Button style={styles.margin} mode="contained" onPress={() => {
                    if (importedKeys == '')
                        dispatch(createNewKeys({ passphrase: password, keys: null }))
                    else
                        dispatch(createNewKeys({ passphrase: password, keys: importedKeys }))
                }}>
                    Create Account
                </Button>
                <Button style={styles.margin} mode="contained" onPress={() => {
                    setReadError(false)
                    setImportModal(true)
                }}>
                    Import Private Key
                </Button>
                {importedKeys != '' &&
                    <Title style={styles.title} > Private key imported! </Title>
                }
                {readError &&
                    <Title style={styles.title}> Read Error </Title>
                }
            </ScrollView>
            <Portal>
                <Modal contentContainerStyle={styles.fullscreenModal} visible={importModal} onDismiss={() => { setImportModal(false) }}>
                    <QRCodeScanner
                        onRead={async (event) => {
                            if (await validateKeyPair(event.data))
                                setImported(event.data)
                            else {
                                setReadError(true)
                                setImported('')
                            }
                        }}
                        reactivate={true}
                    />
                </Modal>
            </Portal>
        </PaperProvider>
    )
}

