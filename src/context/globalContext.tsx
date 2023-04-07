import React, { ReactNode, useReducer, createContext, useContext } from 'react';

type Action = { type: string, payload: DispatchPayload }

export type Todo = {
    id: number,
    title: string,
    description: string,
    created_at?: string,
    completed: boolean,
    user?: string,
    updated_at?: string,
    order?: number
}

type DispatchPayload = {
    [key: string]: Todo[]
}

export type State = {
    completedTodos: Todo[],
    todos: Todo[],
    newTodos: Todo[]
};
const initialState = {
    completedTodos: [],
    todos: [],
    newTodos: []
}
const globalReducer = (
    state: State = initialState,
    action: Action
) => {
    switch (action.type) {
        case "todos":
            return { ...state, todos: action.payload.todos }
        case "completedTodos":
            return { ...state, completedTodos: action.payload.todos }
        case "both":
            return { ...state, ...action.payload }
        case "newTodo":
            return {
                ...state, todos: [...action.payload.newItem,
                ...state.todos], newTodos: [...state.newTodos, ...action.payload.newTodos]
            }
        default:
            return state;
    }
};


export const GlobalContext = createContext<{ state: State, dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => null,
});


export const GlobalContextProvider = ({ children, FetchState }: {
    children: ReactNode,
    FetchState: Partial<State>
}) => {
    const [state, dispatch] = useReducer(globalReducer, { ...initialState, ...FetchState });
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};
export const useGlobalContext = () => useContext(GlobalContext);
