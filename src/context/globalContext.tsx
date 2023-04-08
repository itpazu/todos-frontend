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
    order: number
}

type DispatchPayload = {
    [key: string]: Todo[] | any
}
export type FieldsChanges = Partial<Pick<Todo, "title" | "description">> & { id: number }

export type TodosFromProps = Pick<State, "todos" | "completedTodos">
export type TodosFromState = keyof TodosFromProps
export type MovToDoesHandler = (moveFromArr: TodosFromState, moveToArr: TodosFromState, idx: number) => void

export type State = {
    completedTodos: Todo[],
    todos: Todo[],
    newTodos: Todo[],
    deleted: Todo[]
    statusChanges: Array<[string, boolean]>
    fieldsUpdates: Array<FieldsChanges>
};

export const initialState = {
    completedTodos: [],
    todos: [],
    newTodos: [],
    statusChanges: [],
    fieldsUpdates: [],
    deleted: []
}
const globalReducer = (
    state: State = initialState,
    action: Action
) => {
    const { payload, type } = action
    switch (type) {

        case "todos":
            return { ...state, todos: payload.todos }
        case "completedTodos":
            return { ...state, completedTodos: payload.todos }
        case "both":
        case "statusChanges":
            return { ...state, ...payload }
        case "newTodo":
            return {
                ...state, todos: [...payload.newItem,
                ...state.todos], newTodos: [...state.newTodos, ...payload.newTodos]
            }
        case "discardLocalChanges":
            return { ...initialState, ...payload }
        case "deleteTodo":
            return { ...state, ...payload, deleted: [...state.deleted, ...payload.deleted] }
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
