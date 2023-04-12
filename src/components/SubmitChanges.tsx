
import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useGlobalContext, TodosFromProps, Todo } from "../context/globalContext";
import useFetchTodos from './hooks/useTodos';
import _merge from 'lodash.merge';
import { fetcher } from '../lib/utils';
import Loader from './Loader';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
export default function SubmitChanges({
    areReordered,
    originalTodos }:
    {
        areReordered: boolean,
        originalTodos: TodosFromProps,
    }) {
    const { state, dispatch } = useGlobalContext()
    const { fieldsUpdates, newTodos, deleted, todos, completedTodos } = state;
    const [storeStatus, setStoreStatus] = useState({ error: false, message: '', showMessage: false })
    const [inProgress, setInprogress] = useState(false)
    const { data, error, isLoading, mutate } = useFetchTodos()




    const getUpdates = () => {
        const updatesdCopy = { ...fieldsUpdates }
        const enrichched = Object.entries(updatesdCopy).map(([key, val]) => {
            return [key, { id: parseInt(key), ...val }]
        })
        return Object.fromEntries(enrichched)

    }
    const mergeAllupdateTodos = () => {
        // implement
        const newTodosMap = getNewTodos()
        const updatesWithIds = getUpdates()
        const merged = _merge(newTodosMap, updatesWithIds)

        return merged

    }
    const getNewTodos = () => {
        return newTodos.reduce<{ [index: number]: Omit<Todo, "id"> }>((prev, current) => {
            const { id, ...res } = current;
            prev[id] = res;
            return prev
        }, {}
        )


    }

    const storeLocalChangesInDb = async () => {
        mergeAllupdateTodos()
        const body = Object.values(mergeAllupdateTodos())
        try {
            setInprogress(true)
            const response = await fetcher({ endpoint: 'modify', method: "PUT", body })
            const data = await response.json()
            setInprogress(false)
            if (response.status === 200) {
                setStoreStatus(prev => ({
                    ...prev,
                    message: "successfully stored your changes!", showMessage: true
                }))

            } else {
                const errorMessage = `changes were not stored,
                 try again: ${data?.detail || "unkown reason"}`
                setStoreStatus(prev => ({ ...prev, error: true, message: errorMessage, showMessage: true }))
            }
        } catch (err) {

            setStoreStatus(prev => ({
                ...prev, error: true,
                message: "something went wrong... cahnges not stored",
                showMessage: true
            }))


        }
    }
    return (
        <Stack
            direction="row"
            spacing={2}
            padding={2}
            sx={{ height: "100%" }}

        >
            <Loader open={inProgress} />
            <Alert severity="success" sx={(theme) => ({
                position: 'absolute',
                top: '40%', right: '50%', zIndex: theme.zIndex.drawer + 1
            })}>
                <AlertTitle >Success</AlertTitle>
                This is a success alert — <strong>check it out!</strong>
            </Alert>
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
