import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Paper, Grid } from '@mui/material';
import { Todo as TodoProp } from '../context/globalContext';
import TodoList from './TodoList';

export default function Todos({ fetchtedTodos, fetchedCompleted }: {
    fetchtedTodos: TodoProp[],
    fetchedCompleted: TodoProp[]

}) {

    const [todos, setTodos] = useState(fetchtedTodos)
    const [completedTodos, setcompletedTodos] = useState(fetchedCompleted)

    const completedTodosDropHandler = (e: React.DragEvent<HTMLElement>) => {
        if (e.dataTransfer.getData("completed") === "true") return
        let idx = parseInt(e.dataTransfer.getData("text"))

        let completedItem = todos[idx];
        completedItem.completed = true
        setTodos(prev => {
            let localTodos = [...prev]
            localTodos.splice(idx, 1)
            return localTodos
        })

        setcompletedTodos(prev => {
            let localCompleted = [...prev]
            localCompleted.splice(0, 0, completedItem)
            return localCompleted
        })
    }

    const pendingTodosDropHandler = (e: React.DragEvent<HTMLElement>) => {
        if (e.dataTransfer.getData("completed") === "false") return
        let idx = parseInt(e.dataTransfer.getData("text"))
        let completedItem = completedTodos[idx];
        completedItem.completed = false
        setcompletedTodos(prev => {
            let localTodos = [...prev]
            localTodos.splice(idx, 1)
            return localTodos
        })

        setTodos(prev => {
            let localCompleted = [...prev]
            localCompleted.splice(0, 0, completedItem)
            return localCompleted
        })

    }
    return (
        <>

            <Grid
                justifyContent="center"
                item md={3}
                xs={12}
                onDrop={completedTodosDropHandler}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = "move"
                    // console.log(e.dataTransfer.getData("text"))
                }}

            >
                <Paper sx={{ height: '100%', padding: 2 }}>
                    <TodoList todos={completedTodos} setTodos={setcompletedTodos} setcompletedTodos={setcompletedTodos} />

                </Paper>
            </Grid>
            <Grid
                onDrop={pendingTodosDropHandler}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = "move"
                }}
                justifyContent="center" item md={7} xs={12} >
                <Paper id="source" sx={{ height: '100%', padding: 2 }} >
                    <TodoList todos={todos} setTodos={setTodos} setcompletedTodos={setcompletedTodos} />
                </Paper>
            </Grid>
        </>


    )
}

