import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { Todo } from '../context/globalContext';

const HELPER_TEXT: { [key: string]: string } = {
    title: 'at least 2 character long, must contain character/numbers',
    description: 'please insert a description of at least 10 letters long'

}

export default function AddToDo() {
    const [newTodo, setNewTodo] = useState<Partial<Todo>>({
        title: "",
        description: ""
    })

    const validate = (type: string, input: string) => {
        switch (type) {
            case "email":
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)
            case "name":
                return /^[a-z|A-Z|\s]*$/.test(input)
            case "title":
                return input.length === 0 || (input.length > 1 && /^[a-z|A-Z|1-9\s]*$/.test(input))
            case "description":
                return !!input && input.length > 10
            default:
                return true

        }
    }
    const insertTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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
                    onChange={insertTitle}
                    name="title"
                    value={newTodo.title}
                    error={isValid ? false : true}
                    label="Add Todo"
                    placeholder="What else would you like to do?"
                    helperText={isValid ? "" : HELPER_TEXT["title"]}
                />
                <Fab color="primary" aria-label="add" disabled={!isValid ||
                    (newTodo.title as string).length === 0}>
                    <AddIcon />
                </Fab>
            </Stack>


        </Box>
    );
}