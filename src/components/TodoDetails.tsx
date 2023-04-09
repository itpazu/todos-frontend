import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Todo, State, useGlobalContext, FieldsChanges } from '../context/globalContext';
import { formatDate } from '../lib/utils';
import { validate, HELPER_TEXT } from '../lib/utils';

export default function TodoDetails({ todo, idx }: { todo: Todo, idx: number }) {
    const { title, description, completed, id, created_at, updated_at } = todo
    const { dispatch, state } = useGlobalContext()
    const [editMode, setEditMode] = useState(false)
    const [input, setInput] = useState({
        title,
        description
    })


    const monitorChangesTitle = () => {
        const { title: inputTitle, } = input
        return !(inputTitle === title)
    }

    const monitorChangesDescription = () => {
        const { description: inputDescription, } = input
        return !(inputDescription === description)
    }

    const checkIfChanges = () => {
        return monitorChangesTitle() || monitorChangesDescription()
    }


    const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { currentTarget: { value, name } } = e;
        const keyName = name as "title" | "description"
        setInput(prev => ({
            ...prev,
            [name]: value.length > 0 ? value : todo[keyName]
        }))
    }
    const isValidTitle = validate("title", input.title)
    const isValidDescription = validate("description", input.description)

    const onSubmitChanges = () => {
        const todosArrKey: keyof State = completed ? "completedTodos" : "todos"
        const todosArr = [...state[todosArrKey]]
        const newTodo = { ...todo, ...input }
        todosArr.splice(idx, 1, newTodo)
        const fieldChnges: FieldsChanges = { ...input, id }
        if (!monitorChangesTitle()) delete fieldChnges.title
        if (!monitorChangesDescription()) delete fieldChnges.description

        dispatch({
            type: "statusChanges",
            payload: { [todosArrKey]: todosArr, fieldsUpdates: [...state.fieldsUpdates, { ...fieldChnges }] }

        })
        setEditMode(!editMode)

    }

    return (
        <Card sx={{ minWidth: 150 }} >
            <CardContent >
                <Stack direction={{ sm: "row" }} justifyContent={"space-between"}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        created: {formatDate(created_at as string)}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        Updated: {updated_at && formatDate(updated_at)}
                    </Typography>

                </Stack>

                <Stack padding={4} justifyContent="center">
                    <Typography sx={{
                        textAlign: 'center',


                    }} variant="h5" component="div" gutterBottom>
                        {input.title}
                    </Typography>
                    {editMode &&
                        <TextField

                            label={"Edit title"}
                            sx={{ mb: 3 }}
                            helperText={isValidTitle ? "" : HELPER_TEXT["title"]}
                            error={!isValidTitle}
                            variant="standard"
                            name="title"
                            onChange={onChangeInput}

                        />
                    }
                    <Typography variant="body1" sx={{
                        mb: 3,
                        wordBreak: "break-all"
                    }} >
                        {input.description}
                    </Typography>
                    {editMode &&
                        <TextField
                            label="Edit description"
                            aria-label='edit description'
                            multiline
                            rows={4}
                            variant="outlined"
                            name="description"
                            onChange={onChangeInput}
                            error={!isValidDescription}
                            helperText={isValidDescription ? "" : HELPER_TEXT["description"]}

                        />}
                </Stack>

            </CardContent>
            <Stack direction={{ md: "row" }} justifyContent={"space-between"}>

                <CardActions>
                    <Button
                        size="medium"
                        onClick={() => {
                            editMode && setInput({
                                title,
                                description
                            })
                            setEditMode(!editMode)
                        }}>{editMode ? "discard" : "edit"}</Button>
                </CardActions>
                <CardActions>
                    <Button size="medium" disabled={
                        !(checkIfChanges() && (isValidTitle && isValidDescription))
                    }
                        onClick={onSubmitChanges}>Submit</Button>
                </CardActions>
            </Stack>
        </Card>
    );
}