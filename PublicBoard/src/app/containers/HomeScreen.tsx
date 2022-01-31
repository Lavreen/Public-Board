import React from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Title } from 'react-native-paper';
import { styles } from '../assets/paperTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.center} source={require('../assets/logo.png')}></Image>
            <Title style={styles.title}>Public Board</Title>

            {/* <Button mode="contained" style={styles.homeScreenButton} onPress={() => navigation.navigate('Messages')}>
                    Messages
                </Button> */}
            {/* <Button mode="contained" style={styles.homeScreenButton} onPress={() => navigation.navigate('CreateMessage')}>
                    New message
                </Button> */}
            <Button mode="contained" style={styles.margin} onPress={() => navigation.navigate('Board' as never)}>
                Board
            </Button>
            <Button mode="contained" style={styles.margin} onPress={() => navigation.navigate('Friends' as never)}>
                Friends
            </Button>
            <Button mode="contained" style={styles.margin} onPress={() => navigation.navigate('Profile' as never)}>
                Profile
            </Button>
            <Button mode="contained" style={styles.margin} onPress={() => navigation.navigate('Options' as never)}>
                Options
            </Button>

        </SafeAreaView>

    );
}