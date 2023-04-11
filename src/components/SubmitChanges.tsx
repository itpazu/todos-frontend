
import React from "react";
import { Button, Stack } from "@mui/material";
import { useGlobalContext, TodosFromProps, Todo } from "../context/globalContext";
import useFetchTodos from './hooks/useTodos';

export default function SubmitChanges({
    areReordered,
    originalTodos }:
    {
        areReordered: boolean,
        originalTodos: TodosFromProps,
    }) {
    const { state, dispatch } = useGlobalContext()
    const { fieldsUpdates, newTodos, deleted, todos, completedTodos } = state;
    const { data, error, isLoading, mutate } = useFetchTodos()


    const deleteTodos = () => {
        const storeDeleted = deleted.map(({ id }) => id)
        console.log('deleted todos', storeDeleted)
        // implement

    }

    const updateTodos = () => {
        // implement
        const UpdatesCopy = Object.entries({ ...fieldsUpdates })
        console.log('updates', UpdatesCopy)

    }
    const addTodos = () => {
        const newItems: Partial<Todo>[] = [...newTodos]
        newItems.forEach((newTodo) => delete newTodo.id)
        console.log('new', newItems)

    }
    const storeLocalChangesInDb = () => {
        deleteTodos()
        addTodos()
        updateTodos()

    }
    return (
        <Stack
            direction="row"
            spacing={2}
            padding={2}
            sx={{ height: "100%" }}

        >
            <Button

                sx={{ height: '100%' }}

                size="medium"
                variant="contained"
                onClick={storeLocalChangesInDb}
                disabled={
                    !areReordered && Object.keys(fieldsUpdates).length === 0}>
                submit changes
            </Button>
            <Button
                color="secondary"
                size="medium"
                variant="contained"
                disabled={
                    !areReordered && Object.keys(fieldsUpdates).length === 0
                }
                onClick={() => dispatch({
                    type: 'discardLocalChanges', payload:
                        originalTodos.todos.length > 0 ? originalTodos : { todos: [...newTodos] }
                })}
            >
                discard changes
            </Button>
        </Stack >
    )
}
