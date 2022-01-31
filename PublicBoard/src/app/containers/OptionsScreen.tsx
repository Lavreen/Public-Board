import { useNavigation } from "@react-navigation/native";
import React, { FC, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, Button, Dialog, Divider, List, Modal, Paragraph, Portal, Switch, Text, TextInput, Title } from "react-native-paper";
import { useDispatch } from "react-redux";
import { styles } from "../assets/paperTheme";
import { checkPassword, deleteData } from "../redux/SecurityReducer";
import { AppDispatch } from "../redux/Store";

const OptionsScreen: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [passwordModal, setPasswordModal] = useState<boolean>(false)
    const [wrongPassword, setWrongPassword] = useState<boolean>(false)
    const [wipeDialog, setWipeDialog] = useState<boolean>(false)
    const [exportDialog, setExportDialog] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("");


    const _checkPassword = async () => {
        let match = (await dispatch(checkPassword(password))).payload

        if (match) {
            setWrongPassword(false)
            setPasswordModal(false)
            navigation.navigate('Export' as never)
        } else {
            setWrongPassword(true)
        }
    }


    return (
        <View>
            <Appbar.Header>
                <Appbar.Content title="Options" />
            </Appbar.Header>

            <ScrollView>
                <Divider />
                <List.Item
                    title="Enable auto refresh"
                    description="not yet avaliable"
                    left={() => <List.Icon icon="restart" />}
                    right={() => <Switch disabled={true} value={false} onValueChange={() => { }} />}
                />
                <Divider />
                <List.Item
                    title="Export Account"
                    onPress={() => { setExportDialog(true) }}
                    left={() => <List.Icon icon="account-arrow-right-outline" />}
                />
                <Divider />
                <List.Item
                    title="Delete Account"
                    onPress={() => { setWipeDialog(true) }}
                    left={() => <List.Icon icon="account-remove-outline" />}
                />
                <Divider />

            </ScrollView>

            <Portal>
                <Modal contentContainerStyle={styles.modal} visible={passwordModal} onDismiss={() => { setPasswordModal(false) }}>
                    <Title style={styles.center}>Enter password</Title>
                    <TextInput
                        label={"Password"}
                        mode="outlined"
                        secureTextEntry
                        style={styles.margin}
                        onChangeText={text => setPassword(text)}
                    />
                    {wrongPassword && <Text style={styles.center}>Wrong password</Text>}
                    <Button mode="contained" style={styles.margin} onPress={_checkPassword}>
                        Continue
                    </Button>
                </Modal>

                <Dialog visible={wipeDialog} onDismiss={() => setWipeDialog(false)}>
                    <Dialog.Title>Warning</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>All account data will be lost.{"\n"}This action is unreversable!</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => dispatch(deleteData())}>Delete</Button>
                        <Button onPress={() => setWipeDialog(false)}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={exportDialog} onDismiss={() => setExportDialog(false)}>
                    <Dialog.Title>Warning</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Private key will be exposed.{"\n"}
                            Don't give this key to anyone and handle it carefully.{"\n"}
                            All of security depends on it!
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setExportDialog(false)
                            setPasswordModal(true)
                        }}>
                            Proceed
                        </Button>
                        <Button onPress={() => setExportDialog(false)}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default OptionsScreen;