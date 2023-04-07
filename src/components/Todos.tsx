import React, { useState, useMemo, useEffect } from 'react';
import { Paper, Grid, } from '@mui/material';
import { useGlobalContext } from '../context/globalContext';
import TodoList from './TodoList';
import AddToDo from './AddToDo';
import SubmitChanges from './SubmitChanges';
import { Todo, State } from '../context/globalContext'

export default function Todos() {
    const { dispatch, state: { todos, completedTodos } } = useGlobalContext()
    console.log(useGlobalContext())
    const [changes, setChanges] = useState<{ [index: number]: boolean }>({})

    // cache of the original state - completed / pending per todo in the database
    const originalState = useMemo(() => {
        return [...todos, ...completedTodos].reduce<{ [index: number]: boolean }>((prev, current) => {
            return { ...prev, [current.id]: current.completed }
        }, {})
    }, [])
    // cache the original order of todos
    const originaOrder = useMemo(() => todos.map(({ id }) => id)

        , [])

    // evaluates the difference between original order of todos and the current order
    // returns a boolean to enable submit button if todos order changed
    const isTodosReordered = () => {
        return originaOrder.some((val, idx) => !(val === todos[idx].id))
    }

    // holds the value of the actual changed todos (from false to true and vice versa)
    const filterChanges = useMemo<[string, boolean][]>(() => {
        let entries = Object.entries(changes)
        let newEntries = entries.filter(([id, isCompleted]) => !(isCompleted === originalState[parseInt(id)]))
        return newEntries
    }, [changes])
    console.log(filterChanges)
    const todosDropHandler = (
        e: React.DragEvent<HTMLElement>
    ) => {
        //this line is necessary as Grid is a drop target, we want to avoid 
        //triggering the drop function when reordering inside the group
        if (e.dataTransfer.getData("completed") === "false") return
        let idx = parseInt(e.dataTransfer.getData("text"))
        completedTodos[idx].completed = false

        const { completed, id } = completedTodos[idx];
        setChanges(prev => { return { ...prev, [id]: completed } })
        let completedTodosCopy = [...completedTodos]
        completedTodosCopy.splice(idx, 1)

        let todosCopy = [...todos]
        todosCopy.splice(0, 0, completedTodos[idx])

        dispatch({ type: "both", payload: { todos: todosCopy, completedTodos: completedTodosCopy } })

    }
    const completedTodosDropHandler = (
        e: React.DragEvent<HTMLElement>
    ) => {
        if (e.dataTransfer.getData("completed") === "true") return
        let idx = parseInt(e.dataTransfer.getData("text"))

        todos[idx].completed = true

        const { completed, id } = todos[idx];
        setChanges(prev => { return { ...prev, [id]: completed } })
        let todosCopy = [...todos]
        todosCopy.splice(idx, 1)

        let completedTodosCopy = [...completedTodos]
        completedTodosCopy.splice(0, 0, todos[idx])

        dispatch({ type: "both", payload: { todos: todosCopy, completedTodos: completedTodosCopy } })

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

                <SubmitChanges isReordered={isTodosReordered()} changes={filterChanges} />
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
                    <TodoList todos={completedTodos} />

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
                    <TodoList todos={todos} />
                </Paper>
            </Grid>

        </>


    )
}

