import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { Todo } from '../context/globalContext';
import { validate, HELPER_TEXT } from '../lib/utils';
import { useAppDispatch } from 'src/store/reduxHooks';
import { newTodo as newTodoAction } from '../store/todosSlice';

const newTodoModel: Todo = {
    title: "",
    description: "",
    id: 0,
    completed: false,
}

export default function AddToDo() {

    const reduxDispatch = useAppDispatch()
    const [newTodo, setNewTodo] = useState<Todo>(newTodoModel)

    const submitNewTodo = () => {
        const newTodoCopy = { ...newTodo }
        const { id, ...rest } = newTodoCopy

        reduxDispatch(newTodoAction({
            newItem: newTodoCopy,
            fieldsUpdates: rest,
            id
        }))

        // setting temporaryIds (from 0 to negative to keep them unique) as ids are
        //used in the logic of local changes tracking
        setNewTodo(prev => ({ ...newTodoModel, id: --prev.id }))


    }


    const inputTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { currentTarget: { name, value } } = e;
        setNewTodo(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const isValid = validate("title", newTodo.title as string)
    return (
        <Box
            component="form"
            sx={{
                padding: 2,
                '& .MuiTextField-root': { width: '100%' },
            }}
            // noValidate
            autoComplete="off"
        >
            <Stack direction='row' spacing={1}>
                <TextField
                    onChange={inputTitle}
                    name="title"
                    value={newTodo.title}
                    error={!isValid}
                    label="They talk. You do."
                    placeholder="What else would you like to do?"
                    helperText={isValid ? "" : HELPER_TEXT["title"]}
                />
                <Fab
                    color="primary"
                    aria-label="add"
                    disabled={!isValid ||
                        (newTodo.title as string).length === 0}
                    onClick={submitNewTodo}
                    sx={theme => ({ backgroundColor: theme.palette.secondary.main })}
                >
                    <AddIcon />
                </Fab>
            </Stack>


        </Box>
    );
}