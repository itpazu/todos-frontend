import React, { ReactNode, useReducer, createContext, useContext } from 'react';


export type User = {
    isLoggedIn: boolean
    token: string
    user: { username: string }
}

type Action = { type: string, payload: DispatchPayload }

export type Todo = {
    id: number,
    title: string,
    description: string,
    created_at?: string,
    completed: boolean,
    user?: string,
    updated_at?: string,
    // order: number
}

export type DispatchPayload = {
    [key: string]: Todo[] | any
}
export type FieldsChanges = Partial<Pick<Todo, "title" | "description" | "id">>

export type TodosFromProps = Pick<State, "todos" | "completedTodos">
export type TodosFromState = keyof TodosFromProps
export type MovToDoesHandler = (moveFromArr: TodosFromState, moveToArr: TodosFromState, idx: number) => void

export type TodoChanges<T extends object> = { [key: number]: { [key in keyof T]?: T[key] } }

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
