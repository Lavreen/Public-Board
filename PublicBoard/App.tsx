import React from 'react';
import { Provider } from "react-redux"

import store from './src/app/redux/Store';
import RootScreen from './src/app/containers/RootScreen';
import { Provider as PaperProvider} from 'react-native-paper';
import { styles, theme } from './src/app/assets/paperTheme';

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <RootScreen></RootScreen>
            </PaperProvider>
        </Provider>
    );
}