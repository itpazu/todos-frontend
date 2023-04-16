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
export type FieldsChanges = Partial<Pick<Todo, "title" | "description" | "id">>

export type TodosFromProps = Pick<State, "todos" | "completedTodos">
export type TodosFromState = keyof TodosFromProps
export type MovToDoesHandler = (moveFromArr: TodosFromState, moveToArr: TodosFromState, idx: number) => void

type TodoChanges<T extends object> = { [key: number]: { [key in keyof T]?: T[key] } }

export type State = {
    completedTodos: Todo[],
    todos: Todo[],
    fieldsUpdates: TodoChanges<Todo>
};

export const initialState = {
    todos: [],
    completedTodos: [],
    fieldsUpdates: {},
}
const globalReducer = (
    state: State = initialState,
    action: Action
) => {
    const { payload, type } = action;
    switch (type) {
        case "todos":
            return { ...state, todos: payload.todos }
        case "completedTodos":
            return { ...state, completedTodos: payload.todos }
        case "both":
            return { ...state, ...payload }
        case "removeStatusChange":
            const changeItem = { ...state.fieldsUpdates[payload.id] }
            delete changeItem.completed
            const newState = {
                ...state,
                fieldsUpdates: {
                    ...state.fieldsUpdates,
                    [payload.id]: changeItem
                }
            }
            if (Object.keys(newState.fieldsUpdates[payload.id]).length === 1) {
                delete newState.fieldsUpdates[payload.id]
            }
            return { ...newState }
        case "statusChanges":

            return {
                ...state,
                fieldsUpdates: {
                    ...state.fieldsUpdates, [payload.id]: {
                        ...state.fieldsUpdates[payload.id],
                        ...payload.fieldsUpdates[payload.id]
                    }
                }

            }

        case "newTodo":


            return {
                ...state, todos: [payload.newItem,
                ...state.todos],
                fieldsUpdates: { ...state.fieldsUpdates, ...payload.fieldsUpdates }
            }
        case "editTodo":
            return {
                ...state, ...payload.changedTodoList,
                fieldsUpdates: {
                    ...state.fieldsUpdates,
                    [payload.todoId]: {
                        ...state.fieldsUpdates[payload.todoId],
                        ...payload.fieldsUpdates
                    }
                }
            }
        case "discardLocalChanges":
        case "submitChanges":
            return { ...initialState, ...payload }
        case "deleteNewTodo":
            const fieldsUpdatesCopy = { ...state.fieldsUpdates }
            delete fieldsUpdatesCopy[payload.deleted.id]
            return {
                ...state, ...payload.filteredTodos,
                fieldsUpdates: { ...fieldsUpdatesCopy }
            }
        case "deleteTodo":
            return {
                ...state, ...payload.filteredTodos,
                fieldsUpdates: {
                    ...state.fieldsUpdates,
                    [payload.deleted.id]: {
                        ...state.fieldsUpdates[payload.deleted.id],
                        ...payload.deleted
                    }
                }
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
