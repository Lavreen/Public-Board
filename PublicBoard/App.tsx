import React from 'react';
import { Provider } from "react-redux"
import { NavigationContainer } from '@react-navigation/native'

import store from './src/app/redux/Store';
import MainNavigator from './src/app/navigation/MainNavigator'

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </Provider>
    );
}