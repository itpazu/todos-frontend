
import React from 'react';
import Todos from './Todos';
import { GlobalContextProvider } from '../context/globalContext';
import useFetchTodos from '../components/hooks/useTodos'



export default function TodosContext() {
    const { data, error, isLoading } = useFetchTodos()
    const appData = error ? { todos: [], completedTodos: [] } : data
    return (
        <GlobalContextProvider FetchState={{ ...appData }}>
            <Todos />
        </GlobalContextProvider>


    );
}
