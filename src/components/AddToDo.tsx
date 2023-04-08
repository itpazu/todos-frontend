import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { Todo } from '../context/globalContext';
import axios from 'axios';
import { useGlobalContext } from '../context/globalContext';
import { validate, HELPER_TEXT } from '../lib/utils';


const newTodoModel: Todo = {
    title: "",
    description: "",
    id: 1,
    completed: false,
    order: 0
}

export default function AddToDo() {
    const { dispatch } = useGlobalContext()
    const [newTodo, setNewTodo] = useState<Todo>(newTodoModel)
    // const router = useRouter()
    const submitNewTodo = async () => {
        // error handling
        // const response = await axios.post('/api/todos/addToDo', { title: "router", description: "swr" })
        // // router.reload()

        dispatch({ type: "newTodo", payload: { newItem: [newTodo], newTodos: [newTodo] } })
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
                    label="Add Todo"
                    placeholder="What else would you like to do?"
                    helperText={isValid ? "" : HELPER_TEXT["title"]}
                />
                <Fab
                    color="primary"
                    aria-label="add"
                    disabled={!isValid ||
                        (newTodo.title as string).length === 0}
                    onClick={submitNewTodo}
                >
                    <AddIcon />
                </Fab>
            </Stack>


        </Box>
    );
}