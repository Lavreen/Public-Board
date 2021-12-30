import React from 'react';
import { Provider } from "react-redux"

import store from './src/app/redux/Store';
import RootScreen from './src/app/containers/RootScreen';

export default function App() {
    return (
        <Provider store={store}>
            <RootScreen></RootScreen>
        </Provider>
    );
}