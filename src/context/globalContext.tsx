import React, { ReactNode, useReducer, createContext, useContext } from 'react';

type Action = { type: string, payload?: DispatchPayload }

export type Todo = {
    id: number,
    title: string,
    description: string,
    created_at: string,
    completed: boolean,
    user: string,
    updated_at: string
}

type DispatchPayload = {
    [key: string]: Todo[]
}

type State = {
    completedTodos: Todo[],
    todos: Todo[],
};
const initialState = {
    completedTodos: [],
    todos: [],
}
const globalReducer = (
    state: State = initialState,
    action: Action
) => {
    switch (action.type) {
        case "todos":
        case "completedTodos":
            return { ...state, ...action.payload }
        default:
            return state;
    }
};


export const GlobalContext = createContext<{ state: State, dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => null,
});


export const GlobalContextProvider = ({ children, fetchedResults }: {
    children: ReactNode,
    fetchedResults: State
}) => {
    const [state, dispatch] = useReducer(globalReducer, fetchedResults);
    return (
        <GlobalContext.Provider value={{ state: state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};
export const useGlobalContext = () => useContext(GlobalContext);
