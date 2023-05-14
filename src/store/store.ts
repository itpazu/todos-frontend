import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './todosSlice'
import fieldUpdatedReducer from './fieldUpdates'
const store = configureStore({
    reducer: {
        todos: todosReducer,
        fieldsChanges: fieldUpdatedReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store