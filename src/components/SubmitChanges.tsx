
import React from "react";
import { Button, Box, Stack } from "@mui/material";
import { useGlobalContext, TodosFromProps } from "../context/globalContext";

export default function SubmitChanges({ isReordered, originalTodos }: { isReordered: boolean, originalTodos: TodosFromProps }) {
    const { state: { fieldsUpdates, statusChanges, newTodos }, dispatch } = useGlobalContext()
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

                disabled={statusChanges.length === 0 &&
                    !isReordered && fieldsUpdates.length == 0}>
                submit changes </Button>
            <Button
                // sx={{ height: { sm: '90%' } }}

                color="secondary"
                size="medium"
                variant="contained"
                disabled={statusChanges.length === 0 &&
                    !isReordered && fieldsUpdates.length == 0
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
