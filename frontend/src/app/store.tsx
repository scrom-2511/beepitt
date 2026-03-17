import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import errMsgReducer from '../features/errorMsgs/errMsgsSlice';
import userContactReducer from '../features/userContact/userContactInfoSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  errMsgs: errMsgReducer,
  userContactInfo: userContactReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
