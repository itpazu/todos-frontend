import React, { useState, useMemo, useEffect } from 'react';
import { Paper, Grid, } from '@mui/material';
import { useGlobalContext, TodosFromState, MovToDoesHandler } from '../context/globalContext';
import TodoList from './TodoList';
import AddToDo from './AddToDo';
import SubmitChanges from './SubmitChanges';

// implment edition
// implement delete
//implement submit all changes
// implement discard changes

export default function Todos() {
    const { dispatch, state } = useGlobalContext()
    const { todos, completedTodos, statusChanges } = state;
    const [changes, setChanges] = useState<{ [index: number]: boolean }>({})

    // cache of the original state - completed / pending per todo in the database
    const originalState = useMemo(() => {
        return [...todos, ...completedTodos].reduce<{ [index: number]: boolean }>((prev, current) => {
            return { ...prev, [current.id]: current.completed }
        }, {})
    }, [])
    // cache the original order of todos
    const originaOrder = useMemo(() => todos.map(({ id }) => id), [])

    // evaluates the difference between original order of todos and the current order
    // returns a boolean to enable submit button if todos order changed
    const isTodosReordered = () => {
        return originaOrder.some((val, idx) => !(val === todos[idx].id))
    }

    // holds the value of the actual changed todos (from false to true and vice versa)
    useEffect(() => {
        let entries = Object.entries(changes)
        let newEntries = entries.filter(([id, isCompleted]) => !(isCompleted === originalState[parseInt(id)]))
        dispatch({ type: "statusChanges", payload: { statusChanges: newEntries } })
    }, [changes])

    const moveTodoHandler: MovToDoesHandler = (moveFromArr, moveToArr, idx) => {
        const constTodoToEdit = state[moveFromArr][idx]
        constTodoToEdit.completed = !constTodoToEdit.completed

        const { completed, id } = constTodoToEdit;
        setChanges(prev => ({ ...prev, [id]: completed }))
        let moveFromArrCopy = [...state[moveFromArr]]
        moveFromArrCopy.splice(idx, 1)

        let moveToArrCopy = [...state[moveToArr]]
        moveToArrCopy.splice(0, 0, constTodoToEdit)

        return dispatch({ type: "both", payload: { [moveToArr]: moveToArrCopy, [moveFromArr]: moveFromArrCopy } })
    }

    const todosDropHandler = (
        e: React.DragEvent<HTMLElement>
    ) => {
        //this line is necessary as Grid is a drop target, we want to avoid 
        //triggering the drop function when reordering inside the group
        if (e.dataTransfer.getData("completed") === "false") return
        let idx = parseInt(e.dataTransfer.getData("text"))
        moveTodoHandler("completedTodos", "todos", idx)


    }

    const completedTodosDropHandler = (
        e: React.DragEvent<HTMLElement>
    ) => {
        if (e.dataTransfer.getData("completed") === "true") return
        let idx = parseInt(e.dataTransfer.getData("text"))
        moveTodoHandler("todos", "completedTodos", idx)

    }

    const dragStartHandler = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    return (
        < >

            <Grid
                item
                md={3}
                xs={12}
            >

                <SubmitChanges isReordered={isTodosReordered()} changes={statusChanges} />
            </Grid>
            <Grid item justifyContent={'center'}
                md={7}
                xs={12}>
                <AddToDo />
            </Grid>


            <Grid
                item
                md={3}
                xs={12}
                sx={{ minHeight: { xs: '40vh', md: '70vh' } }}
                onDrop={completedTodosDropHandler}
                onDragOver={dragStartHandler}
            >
                <Paper sx={{ height: '100%', padding: 2 }}>
                    <TodoList todos={completedTodos} moveToDoes={moveTodoHandler} />

                </Paper>
            </Grid>
            <Grid
                item
                md={7}
                xs={12}
                sx={{ minHeight: { xs: '40vh', md: '70vh' } }}
                onDrop={todosDropHandler}
                onDragOver={dragStartHandler}
                justifyContent="center" >
                <Paper id="source" sx={{ height: '100%', padding: 2 }} >
                    <TodoList todos={todos} moveToDoes={moveTodoHandler} />
                </Paper>
            </Grid>

        </>


    )
}

