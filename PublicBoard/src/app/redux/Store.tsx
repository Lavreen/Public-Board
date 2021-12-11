import { configureStore } from '@reduxjs/toolkit'

import MessagesReducer from './MessagesReducer'
import SecurityReducer from './SecurityReducer'
import FriendsReducer from './FriendsReducer';

const store = configureStore({
    reducer: {
        message: MessagesReducer,
        security: SecurityReducer,
        friends: FriendsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;